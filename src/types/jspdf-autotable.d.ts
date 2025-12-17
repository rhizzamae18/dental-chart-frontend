declare module 'jspdf-autotable' {
    import jsPDF from 'jspdf';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export default function autoTable(doc: jsPDF, options: any): void;
}
