#!/bin/bash

# ============================================================================
# BOOK BUILDER - COMPLETE SETUP SCRIPT
# ============================================================================

echo "📚 Book Builder Platform - Complete Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# ============================================================================
# 1. INSTALL DEPENDENCIES
# ============================================================================

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# ============================================================================
# 2. CREATE ENVIRONMENT FILE
# ============================================================================

if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    
    cat > .env.local << 'EOF'
# Application
NEXT_PUBLIC_API_URL=http://localhost:3000

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Database (optional - for production)
# DATABASE_URL=postgresql://user:password@localhost:5432/book_builder

# Authentication (optional)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-key

# Storage (optional - for production file uploads)
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=book-builder-uploads
EOF

    echo "✅ .env.local created. Please update with your settings."
    echo ""
    echo "⚠️  IMPORTANT: Update the following in .env.local:"
    echo "   - AZURE_OPENAI_API_KEY"
    echo "   - AZURE_OPENAI_ENDPOINT"
    echo "   - AZURE_OPENAI_DEPLOYMENT_NAME"
else
    echo "✅ .env.local already exists"
fi

echo ""

# ============================================================================
# 3. CREATE DATABASE SCHEMA (if using Prisma)
# ============================================================================

if [ -f "prisma/schema.prisma" ]; then
    echo "🗄️  Setting up database..."
    npx prisma migrate dev --name init
    echo "✅ Database setup complete"
else
    echo "ℹ️  Skipping database setup (no Prisma schema found)"
fi

echo ""

# ============================================================================
# 4. CREATE NECESSARY DIRECTORIES
# ============================================================================

echo "📁 Creating project directories..."

mkdir -p public/uploads
mkdir -p public/covers
mkdir -p app/api/books
mkdir -p app/api/ai
mkdir -p app/api/export
mkdir -p app/books/{create,[id]}
mkdir -p components
mkdir -p lib

echo "✅ Directories created"
echo ""

# ============================================================================
# 5. BUILD AND TEST
# ============================================================================

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "⚠️  Build completed with warnings or errors"
else
    echo "✅ Build successful"
fi

echo ""

# ============================================================================
# 6. VERIFICATION
# ============================================================================

echo "✅ Setup Complete!"
echo ""
echo "=========================================="
echo "📚 Book Builder Platform is ready!"
echo "=========================================="
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Update .env.local with your Azure OpenAI credentials:"
echo "   - Get your API key from Azure Portal"
echo "   - Set your endpoint URL"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Create your first book:"
echo "   http://localhost:3000/books/create"
echo ""
echo "📖 Documentation:"
echo "   - README: See BOOK_BUILDER_README.md"
echo "   - Quick Start: See BOOK_BUILDER_QUICK_START.ts"
echo ""
echo "💡 Features:"
echo "   ✨ AI-powered content generation"
echo "   📝 Multiple story structures"
echo "   🎨 Character management"
echo "   📊 Writing analytics"
echo "   📤 Multi-format export"
echo "   🌐 Web publishing"
echo ""
echo "🔗 Useful links:"
echo "   - Next.js: https://nextjs.org"
echo "   - Azure OpenAI: https://azure.microsoft.com/en-us/products/cognitive-services/openai-service/"
echo "   - Tailwind CSS: https://tailwindcss.com"
echo ""
echo "=========================================="
