import { useState } from 'react'
import { KotlinPlayground } from './KotlinPlayground'

interface RunnableExample {
  title: string
  description?: string
  code: string
  expectedOutput?: string
  tierLevel: number
}

interface RunnableExamplesProps {
  examples: RunnableExample[]
  /** Show all examples or use tabs */
  layout?: 'tabs' | 'stacked'
}

const tierLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'TL;DR', color: 'bg-blue-100 text-blue-700' },
  2: { label: 'Beginner', color: 'bg-green-100 text-green-700' },
  3: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
  4: { label: 'Deep Dive', color: 'bg-red-100 text-red-700' },
}

export function RunnableExamples({
  examples,
  layout = 'tabs',
}: RunnableExamplesProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (examples.length === 0) {
    return null
  }

  if (layout === 'stacked') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">▶️</span>
          <h3 className="text-lg font-bold text-gray-900">
            Try It Yourself
          </h3>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
            {examples.length} {examples.length === 1 ? 'example' : 'examples'}
          </span>
        </div>

        {examples.map((example, index) => (
          <KotlinPlayground
            key={index}
            code={example.code}
            title={example.title}
            description={example.description}
            expectedOutput={example.expectedOutput}
          />
        ))}
      </div>
    )
  }

  // Tabs layout
  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">▶️</span>
        <h3 className="text-lg font-bold text-gray-900">Try It Yourself</h3>
      </div>

      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 mb-4">
        {examples.map((example, index) => {
          const tier = tierLabels[example.tierLevel] || tierLabels[2]
          const isActive = index === activeIndex

          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{example.title}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? 'bg-white/20 text-white' : tier.color
                }`}
              >
                {tier.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active example */}
      <KotlinPlayground
        code={examples[activeIndex].code}
        title={examples[activeIndex].title}
        description={examples[activeIndex].description}
        expectedOutput={examples[activeIndex].expectedOutput}
        height={350}
      />

      {/* Navigation hint */}
      {examples.length > 1 && (
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>
            Example {activeIndex + 1} of {examples.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={() =>
                setActiveIndex(Math.min(examples.length - 1, activeIndex + 1))
              }
              disabled={activeIndex === examples.length - 1}
              className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RunnableExamples
