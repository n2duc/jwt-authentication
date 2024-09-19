import { useContext, useState, useRef, useEffect } from "react";
import { ChevronLeft, CornerDownLeft } from "lucide-react";
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula as CodeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { AuthType } from "../types";
import { AuthContext } from "../contexts/AuthContext";

import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Link } from "react-router-dom";
import LoadingDots from "../components/LoadingDots";
import { generateChat } from "../apis";

const CodeBlock = ({ className, children }: { className: string, children: string | string[] }) => {
  let lang = 'text'; // default monospaced text
  if (className && className.startsWith('lang-')) {
    lang = className.replace('lang-', '');
  }
  return (
    <ScrollArea className="w-full max-w-fit whitespace-nowrap rounded-md">
      <SyntaxHighlighter language={lang} style={CodeStyle}>
        {children}
      </SyntaxHighlighter>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

const PreBlock = ({ children, ...rest }: { children: React.ReactNode }) => {
  if ('type' in children && children ['type'] === 'code') {
    return CodeBlock(children['props'])
  }
  return <pre {...rest}>{children}</pre>
}

type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

const ChatGemini = () => {
  const { auth } = useContext(AuthContext) as { auth: AuthType }

  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  if (!auth) {
    return <p>Unauthorized</p>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }
    const newMessage: ChatMessage = {
      role: "user",
      parts: [{ text: message }],
    }
    setMessage("")
    setChatHistory([...chatHistory, newMessage])

    try {
      setIsLoading(true)
      // const response = await axios.post(
      //   "http://localhost:8017/v1/ai/generate",
      //   {
      //     prompt: message,
      //     history: [...chatHistory, newMessage],
      //   }
      // );
      const data = await generateChat(message, [...chatHistory, newMessage])
      // const data = response.data;
      setChatHistory((oldHistory) => [
        ...oldHistory,
        { role: "model", parts: [{ text: data.text }] },
      ])
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-10 h-screen min-h-screen">
      <div className="mx-auto max-w-3xl flex flex-col items-center w-full h-full">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to Home</span>
            </Link>
          </Button>
          <p>Gemini AI</p>
          <p className="text-center mb-4 font-normal text-white bg-zinc-800 px-4 py-1 rounded-xl">
            {auth?.username}
          </p>
        </div>
        <div className="relative flex w-full h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
          <ScrollArea className="flex-1 pr-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`mb-4 w-full text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`${msg.role === "user" ? "bg-white border border-zinc-200 text-left" : "bg-zinc-800 text-white"} inline-block p-3 px-4 rounded-2xl`}>
                  {msg.parts.map((part, index) => (
                    <Markdown key={index} options={{ overrides: { pre: PreBlock } }}>{part.text}</Markdown>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 w-full text-sm text-left">
                <div className="bg-zinc-800 text-white p-3 px-4 rounded-2xl w-fit flex items-center justify-center gap-2">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </ScrollArea>
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-8 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="p-3 pt-1 flex items-end">
              <Button type="submit" size="sm" className="ml-auto gap-1.5">
                Send
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatGemini