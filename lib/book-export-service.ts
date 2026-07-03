import { Book, ExportOptions, PublishingConfig } from './book-types';

export class BookExportService {
  private apiEndpoint = '/api/export';

  async exportToPDF(book: Book, options: ExportOptions): Promise<Blob> {
    return this.exportToFormat(book, options, 'pdf');
  }

  async exportToEPUB(book: Book, options: ExportOptions): Promise<Blob> {
    return this.exportToFormat(book, options, 'epub');
  }

  async exportToMOBI(book: Book, options: ExportOptions): Promise<Blob> {
    return this.exportToFormat(book, options, 'mobi');
  }

  async exportToHTML(book: Book, options: ExportOptions): Promise<string> {
    const response = await fetch(`${this.apiEndpoint}/html`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book, options }),
    });
    return response.text();
  }

  async exportToDocx(book: Book, options: ExportOptions): Promise<Blob> {
    return this.exportToFormat(book, options, 'docx');
  }

  private async exportToFormat(
    book: Book,
    options: ExportOptions,
    format: string
  ): Promise<Blob> {
    const response = await fetch(`${this.apiEndpoint}/${format}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book, options }),
    });

    if (!response.ok) throw new Error(`Export failed: ${response.statusText}`);
    return response.blob();
  }

  async downloadFile(book: Book, format: 'pdf' | 'epub' | 'mobi' | 'docx'): Promise<void> {
    const options: ExportOptions = {
      format,
      includeMetadata: true,
      includeCover: true,
    };

    let blob: Blob;
    switch (format) {
      case 'pdf':
        blob = await this.exportToPDF(book, options);
        break;
      case 'epub':
        blob = await this.exportToEPUB(book, options);
        break;
      case 'mobi':
        blob = await this.exportToMOBI(book, options);
        break;
      case 'docx':
        blob = await this.exportToDocx(book, options);
        break;
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.title}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Publishing integrations
  async publishToAmazonKDP(book: Book, config: PublishingConfig): Promise<any> {
    return this.publishToService('amazon-kdp', book, config);
  }

  async publishToSmashwords(book: Book, config: PublishingConfig): Promise<any> {
    return this.publishToService('smashwords', book, config);
  }

  async publishToDraft2Digital(book: Book, config: PublishingConfig): Promise<any> {
    return this.publishToService('draft2digital', book, config);
  }

  async publishToWeb(book: Book, config: PublishingConfig): Promise<string> {
    const response = await fetch(`${this.apiEndpoint}/publish/web`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book, config }),
    });

    if (!response.ok) throw new Error('Web publishing failed');
    const data = await response.json();
    return data.url;
  }

  private async publishToService(
    service: string,
    book: Book,
    config: PublishingConfig
  ): Promise<any> {
    const response = await fetch(`${this.apiEndpoint}/publish/${service}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book, config }),
    });

    if (!response.ok) throw new Error(`Publishing to ${service} failed`);
    return response.json();
  }

  async generateCover(book: Book, style: string = 'modern'): Promise<string> {
    const response = await fetch(`${this.apiEndpoint}/generate-cover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book, style }),
    });

    if (!response.ok) throw new Error('Cover generation failed');
    const data = await response.json();
    return data.coverUrl;
  }

  async generatePrintReady(book: Book): Promise<Blob> {
    return this.exportToFormat(book, {
      format: 'pdf',
      includeMetadata: true,
      includeCover: true,
      paperSize: 'trade',
      fontSize: 12,
      lineHeight: 1.5,
      margin: 1,
    }, 'pdf');
  }

  async getFormatRecommendations(book: Book): Promise<any> {
    const response = await fetch(`${this.apiEndpoint}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book }),
    });

    return response.json();
  }
}

export const bookExport = new BookExportService();
