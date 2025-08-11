
# TopWindow Website

The official website for TopWindow - the ultimate window management tool for macOS.

## 🚀 Technologies

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages (Static Export)

## 🛠 Development

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Export static site:
```bash
npm run export
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with SEO
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── DemoSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── CallToActionSection.tsx
│   └── Footer.tsx
└── lib/
    └── metadata.ts     # SEO configuration
```

## 🎨 Features

- ✅ Responsive design
- ✅ SEO optimized
- ✅ Smooth animations
- ✅ Performance optimized
- ✅ Static site generation
- ✅ Cloudflare Pages ready

## 🚀 Deployment

The site is configured for static export and can be deployed to:

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

For Cloudflare Pages, simply run:
```bash
npm run build
```

The output will be in the `out/` directory.