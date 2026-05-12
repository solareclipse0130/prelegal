declare module "html2pdf.js" {
  type Html2PdfInstance = {
    set: (opts: Record<string, unknown>) => Html2PdfInstance;
    from: (element: Element | string) => Html2PdfInstance;
    save: () => Promise<void>;
    output: (type: string) => Promise<unknown>;
    then: (...args: unknown[]) => Html2PdfInstance;
  };
  const html2pdf: () => Html2PdfInstance;
  export default html2pdf;
}
