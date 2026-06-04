import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { RegisterCard } from "~/modules/authentication";
import { BeeAvatar } from "~/components/ui/BeeAvatar";
import { useConfigurables } from "~/modules/configurables";
import { Link } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.register({
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email, email_verified: user.email_verified });
    return redirect("/", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Registration failed" };
  }
}

export default function RegisterRoute() {
  const { config } = useConfigurables();
  return (
    <div className="min-h-screen bg-[#FFF8E7] honeycomb-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <BeeAvatar size={72} className="mx-auto mb-2" />
          <h1 className="font-fredoka text-[#3D2B1F] text-3xl">Join the Hive!</h1>
          <p className="text-[#8B6A3E] font-nunito text-sm">Create your account to save progress</p>
        </div>
        <RegisterCard />
        <p className="text-center mt-4 text-[#8B6A3E] text-sm font-nunito">
          <Link to="/" className="text-[#FF8C00] font-semibold">← Continue as Guest</Link>
        </p>
      </div>
    </div>
  );
}
