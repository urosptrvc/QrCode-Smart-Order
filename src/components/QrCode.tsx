"use client";
import { QRCode } from "@/src/components/ui/shadcn-io/qr-code";
const QrCodeGenerator = () => (
  <QRCode data="http://www.localhost:3000/table=?1" />
);
export default QrCodeGenerator;
