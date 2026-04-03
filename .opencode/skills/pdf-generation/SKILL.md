---
name: pdf-generation
description: PDF generation patterns. Puppeteer, @react-pdf/renderer, PDFKit, invoices, reports.
---

# PDF Generation

> Choose approach based on: design complexity vs performance needs.

---

## 1. Strategy Selection

| Approach | Tool | When |
|----------|------|------|
| HTML → PDF | Puppeteer / Playwright | Complex layouts, pixel-perfect |
| Code-first | PDFKit / jsPDF | Simple, programmatic |
| React → PDF | @react-pdf/renderer | Component-based, moderate |
| LaTeX | LaTeX + pandoc | Academic, mathematical |
| Word → PDF | docx + convert | Document-style |

---

## 2. Puppeteer (HTML → PDF)

```ts
import puppeteer from "puppeteer";

async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
  });

  await browser.close();
  return Buffer.from(pdf);
}

// Express route
app.get("/invoices/:id/pdf", async (req, res) => {
  const invoice = await db.invoice.findUniqueOrThrow({ where: { id: req.params.id } });
  const html = renderInvoiceHtml(invoice);
  const pdf = await generatePDF(html);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="invoice-${invoice.number}.pdf"`);
  res.send(pdf);
});
```

---

## 3. React PDF

```tsx
import { Document, Page, View, Text, StyleSheet, pdf } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1a1a1a" },
  table: { display: "flex", width: "100%" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", padding: "8 0" },
  cell: { flex: 1, fontSize: 10 },
  total: { fontSize: 14, fontWeight: "bold", textAlign: "right", marginTop: 16 },
});

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice #{invoice.number}</Text>
          <Text>Due: {formatDate(invoice.dueDate)}</Text>
        </View>

        <View style={styles.table}>
          {invoice.lineItems.map(item => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cell}>{item.description}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>Total: {formatCurrency(invoice.total)}</Text>
      </Page>
    </Document>
  );
}

// Generate Buffer
const pdfBuffer = await pdf(<InvoicePDF invoice={invoice} />).toBuffer();
```

---

## 4. Performance Optimization

```ts
// Puppeteer: reuse browser instance
let browser: puppeteer.Browser | null = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  }
  return browser;
}

// Queue PDF generation (avoid overwhelming server)
await pdfQueue.add("generate-invoice", { invoiceId }, {
  attempts: 3,
  removeOnComplete: true,
});

// Cache generated PDFs in S3
const cached = await s3.getObject({ Bucket, Key: `invoices/${id}.pdf` }).catch(() => null);
if (cached) return cached.Body;

const pdf = await generatePDF(html);
await s3.putObject({ Bucket, Key: `invoices/${id}.pdf`, Body: pdf, ContentType: "application/pdf" });
```

---

## 5. Common PDF Types

| Document | Key Features |
|----------|-------------|
| **Invoice** | Line items table, totals, payment info |
| **Report** | Charts (embed as images), data tables |
| **Contract** | Page numbers, signature fields |
| **Label** | QR code, barcode, specific dimensions |
| **Certificate** | Custom fonts, decorative elements |

---

## 6. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| New Puppeteer browser per request | Reuse browser instance |
| Synchronous generation in request | Queue for heavy docs |
| No caching | Cache in S3/CDN |
| External fonts via @import | Embed fonts directly |
| No timeout | Set navigation timeout |
