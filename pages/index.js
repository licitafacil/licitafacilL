import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function LicitaFacilApp() {
  const [edital, setEdital] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);

  const gerarDeclaracoes = async () => {
    setLoading(true);
    setTimeout(() => {
      setResultado(`✔️ Pacote gerado com sucesso!

📄 Documentos incluídos:
- 12 declarações no padrão Galdino
- Verificação automática de certidões
- Seleção de atestados técnicos
- Assinatura centralizada e data formatada

📦 PDF pronto para envio e assinatura digital.`);
      setLoading(false);
    }, 2000);
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        text += strings.join(" ") + "\n";
      }
      setEdital(text);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivo(file);
      if (file.type === "application/pdf") {
        extractTextFromPDF(file);
      } else {
        setEdital(`(Arquivo anexado: ${file.name})`);
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">LicitaFácil</h1>
      <Card className="mb-6">
        <CardContent className="space-y-4">
          <Label htmlFor="upload">📎 Anexar edital (PDF ou imagem):</Label>
          <Input id="upload" type="file" accept=".pdf,image/*" onChange={handleFileChange} />

          <Label htmlFor="edital">📝 Ou cole o conteúdo do edital manualmente:</Label>
          <Textarea
            id="edital"
            rows={10}
            value={edital}
            onChange={(e) => setEdital(e.target.value)}
            placeholder="Ex: Concorrência nº 005/2025 – Objeto: pavimentação urbana..."
          />

          <Button className="mt-2" onClick={gerarDeclaracoes} disabled={loading || !edital}>
            {loading ? "Gerando pacote..." : "Gerar Pacote de Documentos"}
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardContent>
            <pre className="whitespace-pre-wrap text-green-700 font-medium bg-green-50 p-4 rounded-md shadow">{resultado}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}