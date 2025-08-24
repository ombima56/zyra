"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Founders() {
  return (
    <section className="w-full max-w-5xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-center">
            Meet the Founders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Hilary Okello */}
            <Card className="p-6 text-center flex flex-col items-center">
              <div className="rounded-full overflow-hidden w-32 h-32 mb-4">
                <img
                  src="/assets/image.png"
                  alt="Portrait of Hilary Okello"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground mb-2">
                Hilary Okello
              </CardTitle>
              <CardContent className="p-0 text-muted-foreground">
                Software Engineer and Product Lead
              </CardContent>
            </Card>

            {/* Quinter Ochieng */}
            <Card className="p-6 text-center flex flex-col items-center">
              <div className="rounded-full overflow-hidden w-32 h-32 mb-4">
                <img
                  src="/assets/quinter.png"
                  alt="Portrait of Quinter Ochieng"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground mb-2">
                Quinter Abok
              </CardTitle>
              <CardContent className="p-0 text-muted-foreground">
                Software Engineer
              </CardContent>
            </Card>

            {/* Hillary Ombima */}
            <Card className="p-6 text-center flex flex-col items-center">
              <div className="rounded-full overflow-hidden w-32 h-32 mb-4">
                <img
                  src="/assets/ombima.png"
                  alt="Portrait of Hillary Ombima"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground mb-2">
                Hillary Ombima
              </CardTitle>
              <CardContent className="p-0 text-muted-foreground">
                Blockchain Engineer
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
