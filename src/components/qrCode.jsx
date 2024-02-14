import Image from "next/image";
import qrcode from "qrcode";
import { useEffect, useState } from "react";

async function generateQR(text) {
  const qrString = await qrcode.toDataURL(text).catch(() => {
    console.error("Error generating QR code");
    return;
  });
  return qrString || "invalid QR data";
}

export const QRCode = ({ text, size, showTapToCopyText = true }) => {
  const [qrImage, setQrImage] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!text) return;
    generateQR(text).then(setQrImage);
  }, [text]);

  if (!qrImage) return <>Loading...</>;

  const clickHandler = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <button
      className="flex flex-col items-center gap-1 hover:opacity-80"
      onClick={clickHandler}
    >
      <Image src={qrImage} height={size} width={size} />
      {showTapToCopyText && (
        <div className="text-xs">
          {isCopied ? "Copied to clipboard" : "Tap or click to copy"}
        </div>
      )}
    </button>
  );
};
