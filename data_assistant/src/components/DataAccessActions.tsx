import { Check, Globe2, Loader2, Paperclip, Plus } from "lucide-react";
import type { DataSourceStatus } from "../types/domain";

type DataAccessActionsProps = {
  status: DataSourceStatus;
  onConnect: () => void;
  onNewConversation: () => void;
  onUpload: () => void;
};

export function DataAccessActions({
  status,
  onConnect,
  onNewConversation,
  onUpload,
}: DataAccessActionsProps) {
  return (
    <div className="flex min-h-[50px] flex-wrap items-center gap-2 bg-[#FBFCFE] px-3 py-2">
      <button className="home-chip border-[#B8D2EE] bg-[#F2F8FF]" onClick={onNewConversation} type="button">
        <Plus className="h-4 w-4" />
        New Conversation
      </button>
      <button className="home-chip" onClick={onUpload} type="button">
        <Paperclip className="h-4 w-4" />
        Upload File
      </button>
      <button className="home-chip" onClick={onConnect} type="button">
        <Globe2 className="h-4 w-4" />
        Networking
      </button>
      <span className="ml-auto hidden items-center gap-1.5 text-xs text-[#718097] sm:inline-flex">
        {status === "parsing" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1B84B7]" />
        ) : (
          <Check className="h-3.5 w-3.5 text-[#23838B]" />
        )}
        {status === "parsing" ? "Parsing source" : "Source ready"}
      </span>
    </div>
  );
}
