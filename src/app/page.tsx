import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  QrCode,
  Zap,
  CheckCircle,
  ClipboardList,
  BarChart3,
  Users,
} from "lucide-react";
import QrCodeGenerator from "@/src/components/QrCode";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            Smart Ordering Technology
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Smart Drink Ordering System
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-primary-foreground/90 text-pretty">
            Order drinks effortlessly by scanning a QR code at your table and
            receive personalized recommendations powered by smart technology
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Customer Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col h-[450px]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl">
                  For Customers
                </CardTitle>
              </div>
              <CardDescription className="text-base text-muted-foreground">
                Scan the QR code at your table to view our menu, get
                personalized recommendations, and place your order seamlessly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-accent">
                    <Zap className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="text-foreground font-medium">
                    Lightning-fast ordering process
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-accent">
                    <CheckCircle className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="text-foreground font-medium">
                    No waiting for service
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/menu?table=1">Demo Menu (Table 1)</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Staff Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col h-[450px]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/80">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl">
                  For Staff
                </CardTitle>
              </div>
              <CardDescription className="text-base text-muted-foreground">
                Manage orders efficiently, track table status in real-time, and
                provide exceptional service to your customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-foreground font-medium">
                    Real-time order management
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-foreground font-medium">
                    Advanced order analytics
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/admin/orders">Staff Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* QR Generator Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col h-[450px]">
            <CardHeader className="pb-4">
              <div className="flex items-left gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl">
                  QR Generator
                </CardTitle>
              </div>
              <CardDescription className="text-base text-muted-foreground max-w-md mx-auto text-left">
                Generate QR codes for tables to enable easy customer ordering.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-6 flex-grow">
              <div className="w-[200px] h-[200px]">
                <QrCodeGenerator />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
