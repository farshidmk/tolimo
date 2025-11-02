import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";

type Props = {
  onRefetch: () => void;
  errorText?: string;
};

const ErrorHandler: React.FC<Props> = ({
  onRefetch,
  errorText = "خطا در برقراری ارتباط با سرور",
}) => {
  return (
    <div className="relative rounded-md bg-red-100 border border-red-400 text-red-700 px-6 py-4 mb-4 max-w-xl mx-auto">
      <span className="font-semibold flex items-center gap-1">
        <ErrorIcon />
        خطا:
      </span>
      <span className="block sm:inline ml-1">{errorText}</span>
      <button
        type="button"
        className="text-red-500 hover:text-red-700"
        onClick={onRefetch}
        aria-label="Dismiss alert"
      >
        تلاش مجدد
        <RefreshIcon />
      </button>
    </div>
  );
};

export default ErrorHandler;
