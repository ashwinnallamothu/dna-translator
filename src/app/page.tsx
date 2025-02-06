import type { NextPage } from 'next'
import DNATranslator from '@/components/DNATranslator'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            DNA/RNA Translator
          </h1>
          <p className="text-lg text-gray-600">
            Translate DNA/RNA sequences to proteins with codon analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <DNATranslator />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Use this tool to analyze DNA/RNA sequences and their corresponding amino acid translations.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default Home