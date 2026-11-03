import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../common/use-workspace";
import { IdeaFilters } from "../../components/idea-filters";
import { filterIdeas, initialQuery } from "../../common/idea-query";
import {
  IdeaCard,
  ListPagination,
  ListState,
  PageHeading,
} from "../../components/ui";
import { useIdeaOperations } from "../../components/use-idea-operations";

export default function CommunityPage() {
  const { database, loading, error, reload } = useWorkspace();
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const { copy, remove, dialogs } = useIdeaOperations("community");
  const ideas = filterIdeas(database.community, query, "community");
  const maxPage = Math.max(1, Math.ceil(ideas.length / 10));
  const page = Math.min(query.page, maxPage);
  return (
    <>
      <PageHeading
        title="Ideation Community"
        description="Explore ideas shared in the Ideation Community. Copy any idea to Validation to create an editable version for your team."
      />
      <IdeaFilters
        query={query}
        onChange={setQuery}
        ideas={database.community}
        module="community"
      />
      <div className="idea-list">
        {loading || error || !ideas.length ? (
          <ListState
            loading={loading}
            error={error}
            filtered={database.community.length > 0}
            retry={() => void reload()}
          />
        ) : (
          ideas
            .slice((page - 1) * 10, page * 10)
            .map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                module="community"
                onCopy={copy}
                onDelete={remove}
                onDetails={(item) => void navigate(`/community/${item.id}`)}
              />
            ))
        )}
      </div>
      <ListPagination
        page={page}
        total={ideas.length}
        onChange={(page) => setQuery({ ...query, page })}
      />
      {dialogs}
    </>
  );
}
