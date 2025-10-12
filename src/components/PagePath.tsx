import LayoutWidth from './LayoutWidth'

export default function PagePath({ trail }: { trail: string }) {
  return (
    <footer className="text-muted-foreground mt-10 border-t py-4 text-sm">
      <LayoutWidth>
        <div className="truncate">{trail}</div>
      </LayoutWidth>
    </footer>
  )
}
