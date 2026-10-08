import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { MindMapData, SourceLanguage } from '@/lib/queries'
import { difficultyBorderClass } from './Difficulty'

type BubbleData = {
  label: string
  difficulty: string
  module: string
  id: string
  dimmed?: boolean
}

// Theme tokens as CSS variables, so the graph follows light / dark.
const edgeStyles: Record<
  string,
  { stroke: string; strokeWidth: number; strokeDasharray?: string }
> = {
  prerequisite: { stroke: 'var(--jh-brand-a)', strokeWidth: 2.5 },
  related: {
    stroke: 'var(--jh-fainter)',
    strokeWidth: 1.5,
    strokeDasharray: '5 5',
  },
  'next-suggested': { stroke: 'var(--jh-brand-b)', strokeWidth: 2 },
}

// Minimap fills (the attribute default is overridden by these classes).
const MINIMAP_FILL: Record<string, string> = {
  beginner: 'fill-brand-b',
  intermediate: 'fill-brand-a',
  advanced: 'fill-danger',
  expert: 'fill-ink',
}

// Custom bubble node: card-coloured circle with a difficulty-coloured ring.
function BubbleNode({ data }: { data: BubbleData }) {
  return (
    <div
      className={`bg-card text-heading flex size-[140px] cursor-pointer flex-col items-center justify-center rounded-full border-4 p-3 text-center shadow-[0_8px_24px_rgb(0_0_0/0.12)] transition-[transform,opacity] duration-200 hover:scale-110 ${difficultyBorderClass(data.difficulty)} ${data.dimmed ? 'opacity-25' : ''}`}
    >
      {/* Invisible handles: React Flow draws edges only between handles. */}
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
      <div className="text-muted text-[11px] font-medium tracking-wide uppercase">
        {data.difficulty}
      </div>
      <div className="mt-1 line-clamp-3 text-sm leading-tight font-semibold">
        {data.label}
      </div>
    </div>
  )
}

// Node types registration
const nodeTypes = {
  bubble: BubbleNode,
}

/**
 * React Flow ships light-only CSS (unlayered, so utility classes can't beat it).
 * These scoped rules repaint its chrome with the theme tokens.
 */
const FLOW_CSS = `
.learn-flow .react-flow__background circle { fill: var(--jh-border-strong); }
.learn-flow .react-flow__controls { overflow: hidden; border: 1px solid var(--jh-border); border-radius: 12px; box-shadow: none; }
.learn-flow .react-flow__controls-button { width: 30px; height: 30px; padding: 7px; background: var(--jh-card); border-bottom: 1px solid var(--jh-border); color: var(--jh-text); }
.learn-flow .react-flow__controls-button:hover { background: var(--jh-chip); }
.learn-flow .react-flow__controls-button svg { fill: currentColor; }
.learn-flow .react-flow__minimap { overflow: hidden; border: 1px solid var(--jh-border); border-radius: 12px; background: var(--jh-card); }
.learn-flow .react-flow__minimap-mask { fill: var(--jh-bg); fill-opacity: 0.7; }
.learn-flow .react-flow__attribution { background: transparent; }
.learn-flow .react-flow__attribution a { color: var(--jh-faint); }
.learn-flow .react-flow__handle { opacity: 0; border: 0; pointer-events: none; }
`

/**
 * Graph view of the learning map (React Flow): topics laid out by module,
 * dependency arrows, zoom / pan, click a bubble to open the topic.
 */
export function MindMapGraph({
  data,
  query,
  lang,
}: {
  data: MindMapData
  query: string
  lang: SourceLanguage
}) {
  const navigate = useNavigate()

  // Convert API data to React Flow nodes
  const { initialNodes, initialEdges } = useMemo(() => {
    // Group topics by module for layout
    const moduleGroups: Record<string, typeof data.topics> = {}
    data.topics.forEach((topic) => {
      if (!moduleGroups[topic.module]) {
        moduleGroups[topic.module] = []
      }
      moduleGroups[topic.module].push(topic)
    })

    const nodes: Node<BubbleData>[] = []
    const moduleNames = Object.keys(moduleGroups)

    // Layout nodes in a circular/grid pattern by module
    const modulesPerRow = 7
    const moduleSpacingX = 500
    const moduleSpacingY = 400
    const topicSpacingX = 200
    const topicSpacingY = 200

    moduleNames.forEach((moduleName, moduleIndex) => {
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
          ariaLabel: `${topic.title}, ${topic.difficulty}`,
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
    })

    // Convert dependencies to edges
    const edges: Edge[] = data.dependencies.map((dep, index) => {
      const style = edgeStyles[dep.type] || edgeStyles.related
      return {
        id: `e-${index}`,
        source: dep.from,
        target: dep.to,
        type: 'smoothstep',
        animated: dep.type === 'prerequisite',
        style,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.stroke,
        },
      }
    })

    return { initialNodes: nodes, initialEdges: edges }
  }, [data])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when data loads
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  // Search dims the topics that don't match.
  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const dimmed =
          query !== '' && !node.data.label.toLowerCase().includes(query)
        return node.data.dimmed === dimmed
          ? node
          : { ...node, data: { ...node.data, dimmed } }
      }),
    )
  }, [query, setNodes, initialNodes])

  // Handle node click - navigate to topic
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      navigate({
        to: '/learn-kotlin/$topicId',
        params: { topicId: node.id },
        search: { lang: lang || undefined },
      })
    },
    [navigate, lang],
  )

  return (
    <div className="border-line bg-subtle learn-flow h-[70vh] min-h-[500px] overflow-hidden rounded-2xl border">
      <style>{FLOW_CSS}</style>
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
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background gap={20} />
        <Controls showInteractive={false} />
        <MiniMap
          className="hidden sm:block"
          nodeClassName={(node) =>
            MINIMAP_FILL[
              (node.data as BubbleData | undefined)?.difficulty ?? ''
            ] ?? 'fill-fainter'
          }
        />
      </ReactFlow>
    </div>
  )
}
