// GoogleAuthFailed.jsx
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-white">
          Google Sign In Failed
        </h1>

        <p className="mt-3 text-slate-400 leading-relaxed">
          We couldn't authenticate your Google account. This may happen if you
          cancelled the login process, denied permissions, or a temporary server
          error occurred.
        </p>

        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-left">
          <h2 className="font-semibold text-red-400">Possible reasons</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li>Authentication was cancelled.</li>
            <li>Your session expired.</li>
            <li>Network or server issue.</li>
            <li>Google account permissions were denied.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          If the problem persists, please contact support or try another
          authentication method.
        </p>
      </div>
    </div>
  );
}
