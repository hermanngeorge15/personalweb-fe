import { useCallback, useMemo } from 'react'
import AppShell from '@/components/AppShell'
import { Link, useNavigate } from '@tanstack/react-router'
import { useKotlinMindMap } from '@/lib/queries'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'
import { Button } from '@heroui/react'
import { H1 } from '@/components/ui/Typography'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Difficulty colors
const difficultyColors: Record<string, { bg: string; border: string; text: string }> = {
  beginner: {
    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: '#059669',
    text: '#ffffff',
  },
  intermediate: {
    bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    border: '#d97706',
    text: '#ffffff',
  },
  advanced: {
    bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    border: '#ea580c',
    text: '#ffffff',
  },
  expert: {
    bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    border: '#dc2626',
    text: '#ffffff',
  },
}

// Module colors for grouping
const moduleColors: Record<string, string> = {
  'OOP Fundamentals': '#8b5cf6',
  'Class Types': '#3b82f6',
  'Variables & Properties': '#10b981',
  'Functions': '#f59e0b',
  'Collections': '#ec4899',
  'Advanced Topics': '#ef4444',
}

// Custom bubble node component
function BubbleNode({ data }: { data: { label: string; difficulty: string; module: string; id: string } }) {
  const colors = difficultyColors[data.difficulty] || difficultyColors.beginner
  const moduleColor = moduleColors[data.module] || '#6b7280'

  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        background: colors.bg,
        border: `4px solid ${colors.border}`,
        boxShadow: `0 8px 32px ${colors.border}40, 0 0 0 3px ${moduleColor}30`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        textAlign: 'center',
      }}
    >
      <div
        className="text-xs font-medium uppercase tracking-wide opacity-80"
        style={{ color: colors.text }}
      >
        {data.difficulty}
      </div>
      <div
        className="mt-1 line-clamp-3 text-sm font-bold leading-tight"
        style={{ color: colors.text }}
      >
        {data.label}
      </div>
    </div>
  )
}

// Node types registration
const nodeTypes = {
  bubble: BubbleNode,
}

// Edge styles
const edgeStyles = {
  prerequisite: {
    stroke: '#8b5cf6',
    strokeWidth: 3,
    animated: true,
  },
  related: {
    stroke: '#6b7280',
    strokeWidth: 2,
    strokeDasharray: '5,5',
  },
  'next-suggested': {
    stroke: '#3b82f6',
    strokeWidth: 2,
  },
}

function KotlinMindMap() {
  const navigate = useNavigate()
  const { data: mindMapData, isLoading, error } = useKotlinMindMap()

  useEffect(() => {
    setHead({
      title: `Kotlin Mind Map — ${SEO_DEFAULTS.siteName}`,
      description:
        'Interactive mind map of Kotlin topics. Visualize your learning path and explore topic relationships.',
      canonical: `${SEO_DEFAULTS.siteUrl}/learn-kotlin/mindmap`,
      og: {
        title: `Kotlin Mind Map — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/learn-kotlin/mindmap`,
        image: SEO_DEFAULTS.image,
        description: 'Interactive mind map of Kotlin topics',
      },
    })
  }, [])

  // Convert API data to React Flow nodes
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!mindMapData) return { initialNodes: [], initialEdges: [] }

    // Group topics by module for layout
    const moduleGroups: Record<string, typeof mindMapData.topics> = {}
    mindMapData.topics.forEach((topic) => {
      if (!moduleGroups[topic.module]) {
        moduleGroups[topic.module] = []
      }
      moduleGroups[topic.module].push(topic)
    })

    const nodes: Node[] = []
    const moduleNames = Object.keys(moduleGroups)

    // Layout nodes in a circular/grid pattern by module
    let moduleIndex = 0
    const modulesPerRow = 3
    const moduleSpacingX = 500
    const moduleSpacingY = 400
    const topicSpacingX = 200
    const topicSpacingY = 200

    moduleNames.forEach((moduleName) => {
      const topics = moduleGroups[moduleName]
      const moduleRow = Math.floor(moduleIndex / modulesPerRow)
      const moduleCol = moduleIndex % modulesPerRow
      const moduleBaseX = moduleCol * moduleSpacingX
      const moduleBaseY = moduleRow * moduleSpacingY * 2

      // Arrange topics in a grid within each module
      const topicsPerRow = Math.ceil(Math.sqrt(topics.length))

      topics.forEach((topic, topicIndex) => {
        const topicRow = Math.floor(topicIndex / topicsPerRow)
        const topicCol = topicIndex % topicsPerRow

        nodes.push({
          id: topic.id,
          type: 'bubble',
          position: {
            x: moduleBaseX + topicCol * topicSpacingX,
            y: moduleBaseY + topicRow * topicSpacingY,
          },
          data: {
            label: topic.title,
            difficulty: topic.difficulty,
            module: topic.module,
            id: topic.id,
          },
        })
      })

      moduleIndex++
    })

    // Convert dependencies to edges
    const edges: Edge[] = mindMapData.dependencies.map((dep, index) => {
      const style = edgeStyles[dep.type as keyof typeof edgeStyles] || edgeStyles.related
      return {
        id: `e-${index}`,
        source: dep.from,
        target: dep.to,
        type: 'smoothstep',
        animated: dep.type === 'prerequisite',
        style: {
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.stroke,
        },
      }
    })

    return { initialNodes: nodes, initialEdges: edges }
  }, [mindMapData])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when data loads
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [initialNodes, initialEdges, setNodes, setEdges])

  // Handle node click - navigate to topic
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      navigate({
        to: '/learn-kotlin/$topicId',
        params: { topicId: node.id },
      })
    },
    [navigate]
  )

  return (
    <AppShell path="Learn Kotlin / Mind Map">
      <MotionSection variant="slide-up">
        <section className="relative overflow-hidden rounded-3xl border border-purple-200/50 bg-white/40 p-6 shadow-lg ring-1 ring-purple-500/10 backdrop-blur md:p-8">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/20 to-cyan-400/20 blur-3xl" />

          <div className="relative">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <H1 className="bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Learning Mind Map
                </H1>
                <p className="text-muted-foreground mt-2">
                  Click any topic bubble to start learning. Arrows show prerequisites.
                </p>
              </div>
              <Link to="/learn-kotlin">
                <Button variant="bordered" size="sm">
                  ← Back to Topics
                </Button>
              </Link>
            </div>

            {/* Legend */}
            <div className="mb-4 flex flex-wrap items-center gap-6 rounded-lg border border-gray-200 bg-white/60 p-3">
              <span className="text-sm font-medium text-gray-700">Difficulty:</span>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-green-500 to-green-600" />
                <span className="text-xs text-gray-600">Beginner</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600" />
                <span className="text-xs text-gray-600">Intermediate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600" />
                <span className="text-xs text-gray-600">Advanced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-red-500 to-red-600" />
                <span className="text-xs text-gray-600">Expert</span>
              </div>
            </div>

            {/* Mind Map Canvas */}
            <div
              className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
              style={{ height: '70vh', minHeight: 500 }}
            >
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-r-transparent" />
                </div>
              )}

              {error && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-600">Failed to load mind map</p>
                    <Button
                      variant="bordered"
                      size="sm"
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              {!isLoading && !error && nodes.length > 0 && (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  connectionMode={ConnectionMode.Loose}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  minZoom={0.2}
                  maxZoom={2}
                  attributionPosition="bottom-left"
                >
                  <Background color="#e5e7eb" gap={20} />
                  <Controls
                    className="rounded-lg border border-gray-200 bg-white shadow-lg"
                    showInteractive={false}
                  />
                  <MiniMap
                    className="rounded-lg border border-gray-200 bg-white shadow-lg"
                    nodeColor={(node) => {
                      const colors = difficultyColors[node.data?.difficulty] || difficultyColors.beginner
                      return colors.border
                    }}
                    maskColor="rgba(255, 255, 255, 0.8)"
                  />
                </ReactFlow>
              )}

              {!isLoading && !error && nodes.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600">No topics available yet</p>
                    <Link to="/learn-kotlin">
                      <Button variant="bordered" size="sm" className="mt-4">
                        View Topics List
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>💡 Tips:</span>
              <span>Scroll to zoom</span>
              <span>•</span>
              <span>Drag to pan</span>
              <span>•</span>
              <span>Click bubble to learn</span>
            </div>
          </div>
        </section>
      </MotionSection>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: KotlinMindMap,
})
