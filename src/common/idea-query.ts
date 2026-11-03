import { CURRENT_USER } from "./mock-data";
import type { Idea, ListQuery } from "./types";

export const initialQuery: ListQuery = {
  page: 1,
  product: "",
  segment: "",
  objective: "",
  channel: "",
  priority: "",
  sort: "newest",
  search: "",
  mine: false,
};

export function filterIdeas(
  ideas: Idea[],
  query: ListQuery,
  module: "leads" | "community" | "validation"
) {
  const search = query.search.trim().toLowerCase();
  return ideas
    .filter(
      (idea) =>
        (!query.product || idea.product === query.product) &&
        (!query.segment || idea.segment === query.segment) &&
        (!query.objective || idea.objective === query.objective) &&
        (!query.channel || idea.channels.includes(query.channel)) &&
        (!query.priority || idea.priority === query.priority) &&
        (!query.mine ||
          (module === "validation" ? idea.copiedById : idea.authorId) ===
            CURRENT_USER.id) &&
        (!search ||
          `${idea.title} ${idea.description} ${idea.product} ${idea.productDescription} ${idea.segment} ${idea.objective} ${idea.objectiveDescription}`
            .toLowerCase()
            .includes(search))
    )
    .sort((a, b) =>
      query.sort === "score"
        ? b.score - a.score
        : query.sort === "oldest"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt)
    );
}
