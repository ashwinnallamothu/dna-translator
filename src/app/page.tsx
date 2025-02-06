import type { NextPage } from 'next'
import DNATranslator from '@/components/DNATranslator'
import { SequenceAnalysisTools } from '@/components/SequenceAnalysisTools'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Enhanced DNA/RNA Analysis Suite
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive DNA/RNA sequence analysis with protein translation, hydrophobicity plots, and motif detection
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <DNATranslator />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Use this tool to analyze DNA/RNA sequences, predict protein sequences, explore hydrophobicity patterns, 
            detect common motifs, and analyze GC content distribution.
          </p>
          <p className="mt-2">
            Hover over codons and amino acids to see their relationships. Use different reading frames to find 
            alternative open reading frames.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default Home