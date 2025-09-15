// ChatBox.tsx
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  course_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  content_type: string
};

export default function ChatBox({ courseId }: { courseId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;
      if (!token) {
        toast({
          title: "Auth error",
          description: "Not logged in",
          variant: "destructive",
        });
        return;
      }
      setCurrentUserId(session?.data.session.user?.id ?? null);

      const socket = io("http://localhost:3000", {
        auth: { token },
      });
      socketRef.current = socket;
      socket.onAny((event, ...args) => {
        console.log("📡 SOCKET EVENT:", event, args);
      });

      socket.on("connect", () => setLoading(false));

      socket.on("connect_error", (err) => {
        console.error("Socket connect_error", err);
        toast({
          title: "Chat Error",
          description: err.message,
          variant: "destructive",
        });
      });

      socket.on("history", (history: Message[]) => {
        if (!mounted) return;
        setMessages(history);
        scrollToBottom();
        setTimeout(scrollToBottom, 50);
      });

      socket.on("newMessage", (msg: Message) => {
        console.log("message", msg);
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      });

      // join the course room
      socket.emit("joinCourse", { courseId });

      return () => {
        mounted = false;
        socket.emit("leaveCourse", { courseId });
        socket.disconnect();
      };
    })();
  }, [courseId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!text.trim()) return;
    socketRef.current?.emit("sendMessage", { courseId, content: text.trim() });
    setText("");
  };

  return (
    <div className="w-80 max-h-[70vh] shadow-2xl rounded-2xl bg-white flex flex-col">
      <Card className="w-full max-w-xl shadow-2xl rounded-2xl border-0">
        <CardHeader className="bg-primary text-white rounded-t-2xl">
          <CardTitle className="text-xl font-bold">💬 Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="h-96 overflow-y-auto bg-background px-4 py-2 space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Connecting...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
                messages.map((msg) => (
  <div
    key={msg.id || `${msg.sender_id}-${msg.created_at}`}
    className={`flex items-end ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
  >
    {/* Avatar for others */}
    {msg.sender_id !== currentUserId && (
      <Avatar className="mr-2 h-8 w-8 bg-primary/50 flex items-center justify-center text-white font-bold text-sm">
        {msg.sender_name?.[0] ?? "?"}
      </Avatar>
    )}

    {/* Message bubble */}
    <div
      className={`px-4 py-2 rounded-xl shadow max-w-[70%] break-words ${
        msg.sender_id === currentUserId
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-900 border border-gray-300"
      }`}
    >
      <div className="text-sm font-semibold mb-1">{msg.sender_name ?? "Unknown"}</div>
      <div>{msg.content}</div>
      <div className="text-xs text-gray-700 mt-1">
        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>

    {/* Avatar for current user */}
    {msg.sender_id === currentUserId && (
      <Avatar className="ml-2 h-8 w-8 bg-blue-500/50 flex items-center justify-center text-white font-bold text-sm">
        {msg.sender_name?.[0] ?? "?"}
      </Avatar>
    )}
  </div>
))

          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="bg-background rounded-b-2xl px-4 py-3">
          <form
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              className="flex-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              autoFocus
            />
            <Button type="submit" disabled={loading || !text.trim()}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
