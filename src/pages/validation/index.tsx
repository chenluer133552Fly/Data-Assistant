import { useState } from "react";
import { useWorkspace } from "../../common/use-workspace";
import { IdeaFilters } from "../../components/idea-filters";
import { filterIdeas, initialQuery } from "../../common/idea-query";
import {
  IdeaCard,
  ListPagination,
  ListState,
  PageHeading,
} from "../../components/ui";

export default function ValidationPage() {
  const { database, loading, error, reload } = useWorkspace();
  const [query, setQuery] = useState(initialQuery);
  const ideas = filterIdeas(database.validation, query, "validation");
  return (
    <>
      <PageHeading
        title="Validation"
        description="Review and edit saved ideas with team members."
      />
      <IdeaFilters
        query={query}
        onChange={setQuery}
        ideas={database.validation}
        module="validation"
      />
      <div className="idea-list">
        {loading || error || !ideas.length ? (
          <ListState
            loading={loading}
            error={error}
            filtered={database.validation.length > 0}
            retry={() => void reload()}
          />
        ) : (
          ideas
            .slice((query.page - 1) * 10, query.page * 10)
            .map((idea) => (
              <IdeaCard key={idea.id} idea={idea} module="validation" />
            ))
        )}
      </div>
      <ListPagination
        page={query.page}
        total={ideas.length}
        onChange={(page) => setQuery({ ...query, page })}
      />
    </>
  );
}
