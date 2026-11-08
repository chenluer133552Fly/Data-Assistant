import { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useIdeaOperations } from "../../components/use-idea-operations";
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
    const navigate = useNavigate();
    const [query, setQuery] = useState(initialQuery);
    const { remove, dialogs } = useIdeaOperations("validation", () =>
        setQuery((previous) => ({ ...previous, page: 1 })),
    );
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
            <div className="idea-list flex flex-col gap-[12px]">
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
                            <IdeaCard
                                key={idea.id}
                                idea={idea}
                                module="validation"
                                onDetails={(idea) =>
                                    void navigate(`/validation/${idea.id}`)
                                }
                                onEdit={(idea) =>
                                    void navigate(
                                        `/validation/${idea.id}?edit=1`,
                                    )
                                }
                                onDelete={remove}
                            />
                        ))
                )}
            </div>
            <ListPagination
                page={query.page}
                total={ideas.length}
                onChange={(page) => setQuery({ ...query, page })}
            />
            {dialogs}
        </>
    );
}
