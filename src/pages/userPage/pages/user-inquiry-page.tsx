import { BackButton } from "@/components/ui/back-button";

export default function UserInquiryPage() {
  const handleEmailClick = () => {
    window.location.href = "mailto:firstSori80@gmail.com";
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-white p-8"
      style={{ minHeight: "100dvh" }}
    >
      <div className="relative mb-10 flex items-center justify-center">
        <BackButton className="absolute left-0" />
        <p className="font-bold text-base text-red-200">문의사항</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <p className="text-center font-medium text-base text-neutral-800">
          서비스 이용 중 문의사항이 있으시면
          <br />
          아래 이메일로 연락 부탁드립니다.
        </p>

        <button
          type="button"
          onClick={handleEmailClick}
          className="rounded-lg bg-red-200 px-6 py-3 font-semibold text-base text-white transition-colors hover:bg-red-300"
        >
          firstSori80@gmail.com
        </button>
      </div>
    </div>
  );
}
