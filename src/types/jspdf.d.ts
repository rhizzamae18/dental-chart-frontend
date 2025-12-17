declare module 'jspdf' {
    export default class jsPDF {
        constructor(orientation?: string, unit?: string, format?: string);

        internal: {
            pageSize: {
                getWidth(): number;
                getHeight(): number;
            };
        };

        text(text: string | string[], x: number, y: number, options?: { align?: string }): jsPDF;
        setFontSize(size: number): jsPDF;
        setFont(font: string, style: string): jsPDF;
        setTextColor(r: number, g: number, b: number): jsPDF;
        setDrawColor(r: number, g: number, b: number): jsPDF;
        setFillColor(r: number, g: number, b: number): jsPDF;
        setLineWidth(width: number): jsPDF;

        line(x1: number, y1: number, x2: number, y2: number): jsPDF;
        rect(x: number, y: number, width: number, height: number): jsPDF;
        roundedRect(x: number, y: number, width: number, height: number, rx: number, ry: number, style?: string): jsPDF;
        circle(x: number, y: number, radius: number): jsPDF;

        addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): jsPDF;
        addPage(): jsPDF;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        splitTextToSize(text: string, maxWidth: number): any[];

        save(filename: string): void;

        // For jspdf-autotable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable(options: any): jsPDF;
        lastAutoTable: { finalY: number };
    }
}
