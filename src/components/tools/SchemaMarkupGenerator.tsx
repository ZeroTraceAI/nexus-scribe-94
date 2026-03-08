import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schemaTypes: Record<string, { fields: { name: string; label: string; placeholder: string; type?: string }[]; generator: (data: Record<string, string>) => object }> = {
  Article: {
    fields: [
      { name: "headline", label: "Headline", placeholder: "Your article title" },
      { name: "description", label: "Description", placeholder: "Brief article description" },
      { name: "author", label: "Author Name", placeholder: "John Doe" },
      { name: "datePublished", label: "Date Published", placeholder: "2026-03-08", type: "date" },
      { name: "image", label: "Image URL", placeholder: "https://example.com/image.jpg" },
      { name: "url", label: "Article URL", placeholder: "https://example.com/article" },
    ],
    generator: (d) => ({ "@context": "https://schema.org", "@type": "Article", headline: d.headline, description: d.description, author: { "@type": "Person", name: d.author }, datePublished: d.datePublished, image: d.image, url: d.url }),
  },
  Organization: {
    fields: [
      { name: "name", label: "Organization Name", placeholder: "Acme Inc." },
      { name: "url", label: "Website URL", placeholder: "https://example.com" },
      { name: "logo", label: "Logo URL", placeholder: "https://example.com/logo.png" },
      { name: "description", label: "Description", placeholder: "A brief description of the organization" },
      { name: "email", label: "Contact Email", placeholder: "info@example.com" },
      { name: "phone", label: "Phone", placeholder: "+1-555-000-0000" },
    ],
    generator: (d) => ({ "@context": "https://schema.org", "@type": "Organization", name: d.name, url: d.url, logo: d.logo, description: d.description, contactPoint: { "@type": "ContactPoint", email: d.email, telephone: d.phone } }),
  },
  Product: {
    fields: [
      { name: "name", label: "Product Name", placeholder: "Amazing Widget" },
      { name: "description", label: "Description", placeholder: "A revolutionary widget" },
      { name: "image", label: "Image URL", placeholder: "https://example.com/product.jpg" },
      { name: "price", label: "Price", placeholder: "29.99" },
      { name: "currency", label: "Currency", placeholder: "USD" },
      { name: "brand", label: "Brand", placeholder: "Acme" },
    ],
    generator: (d) => ({ "@context": "https://schema.org", "@type": "Product", name: d.name, description: d.description, image: d.image, brand: { "@type": "Brand", name: d.brand }, offers: { "@type": "Offer", price: d.price, priceCurrency: d.currency, availability: "https://schema.org/InStock" } }),
  },
  LocalBusiness: {
    fields: [
      { name: "name", label: "Business Name", placeholder: "Joe's Coffee Shop" },
      { name: "address", label: "Street Address", placeholder: "123 Main St" },
      { name: "city", label: "City", placeholder: "San Francisco" },
      { name: "state", label: "State", placeholder: "CA" },
      { name: "zip", label: "ZIP Code", placeholder: "94105" },
      { name: "phone", label: "Phone", placeholder: "+1-555-123-4567" },
    ],
    generator: (d) => ({ "@context": "https://schema.org", "@type": "LocalBusiness", name: d.name, address: { "@type": "PostalAddress", streetAddress: d.address, addressLocality: d.city, addressRegion: d.state, postalCode: d.zip }, telephone: d.phone }),
  },
  FAQPage: {
    fields: [
      { name: "q1", label: "Question 1", placeholder: "What is your product?" },
      { name: "a1", label: "Answer 1", placeholder: "Our product is..." },
      { name: "q2", label: "Question 2", placeholder: "How much does it cost?" },
      { name: "a2", label: "Answer 2", placeholder: "Pricing starts at..." },
      { name: "q3", label: "Question 3", placeholder: "Is there a free trial?" },
      { name: "a3", label: "Answer 3", placeholder: "Yes, we offer a..." },
    ],
    generator: (d) => {
      const questions = [];
      for (let i = 1; i <= 3; i++) {
        if (d[`q${i}`] && d[`a${i}`]) {
          questions.push({ "@type": "Question", name: d[`q${i}`], acceptedAnswer: { "@type": "Answer", text: d[`a${i}`] } });
        }
      }
      return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions };
    },
  },
  BreadcrumbList: {
    fields: [
      { name: "item1_name", label: "Level 1 Name", placeholder: "Home" },
      { name: "item1_url", label: "Level 1 URL", placeholder: "https://example.com" },
      { name: "item2_name", label: "Level 2 Name", placeholder: "Blog" },
      { name: "item2_url", label: "Level 2 URL", placeholder: "https://example.com/blog" },
      { name: "item3_name", label: "Level 3 Name", placeholder: "My Article" },
      { name: "item3_url", label: "Level 3 URL", placeholder: "https://example.com/blog/article" },
    ],
    generator: (d) => {
      const items = [];
      for (let i = 1; i <= 3; i++) {
        if (d[`item${i}_name`]) items.push({ "@type": "ListItem", position: i, name: d[`item${i}_name`], item: d[`item${i}_url`] });
      }
      return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
    },
  },
};

const SchemaMarkupGenerator = () => {
  const [schemaType, setSchemaType] = useState("Article");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");

  const schema = schemaTypes[schemaType];

  const updateField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generate = () => {
    const result = schema.generator(formData);
    setOutput(JSON.stringify(result, null, 2));
  };

  const copySchema = () => {
    navigator.clipboard.writeText(`<script type="application/ld+json">\n${output}\n</script>`);
    toast({ title: "Schema markup copied!" });
  };

  const copyJson = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "JSON-LD copied!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Schema Type</label>
        <Select value={schemaType} onValueChange={(v) => { setSchemaType(v); setFormData({}); setOutput(""); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.keys(schemaTypes).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schema.fields.map((field) => (
          <div key={field.name}>
            <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
            <Input type={field.type || "text"} placeholder={field.placeholder} value={formData[field.name] || ""} onChange={(e) => updateField(field.name, e.target.value)} />
          </div>
        ))}
      </div>

      <Button onClick={generate} className="w-full">Generate Schema Markup</Button>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">JSON-LD Output</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyJson}><Copy className="h-3.5 w-3.5 mr-1" />JSON</Button>
              <Button size="sm" variant="outline" onClick={copySchema}><Copy className="h-3.5 w-3.5 mr-1" />HTML</Button>
            </div>
          </div>
          <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-foreground">{output}</pre>
          <p className="text-xs text-muted-foreground">Paste this JSON-LD in a {"<script>"} tag in your page's {"<head>"} section, or use the "Copy HTML" button for the complete tag.</p>
        </div>
      )}
    </div>
  );
};

export default SchemaMarkupGenerator;
