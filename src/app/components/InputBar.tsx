import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PenLine, ImageIcon } from "lucide-react"

export default function InputBar() {
  return (
    <Card className="w-full max-w-3xl mx-auto rounded-3xl">
      <div className="flex items-center gap-2 p-2 px-3">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <PenLine className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
        <Input
          className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          placeholder="Start typing..."
        />
        <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6">start recording</Button>
      </div>
    </Card>
  )
}

