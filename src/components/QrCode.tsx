"use client";
import { QRCode } from "@/src/components/ui/shadcn-io/qr-code";

const url = process.env.NEXT_PUBLIC_AUTH_TOKEN;

const QrCodeGenerator = () => <QRCode data={`${url}/table=?1`} />;

export default QrCodeGenerator;
