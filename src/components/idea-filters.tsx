import { Checkbox, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CHANNELS, PRODUCTS } from "../common/mock-data";
import type { Idea, ListQuery } from "../common/types";
import type { IdeaModule } from "./ui";
const options = (values: string[]) =>
  values.map((value) => ({ label: value, value }));

export function IdeaFilters({
  query,
  onChange,
  ideas,
  module,
}: {
  query: ListQuery;
  onChange: (query: ListQuery) => void;
  ideas: Idea[];
  module: IdeaModule;
}) {
  function change(key: keyof ListQuery, value: string | boolean) {
    onChange({ ...query, [key]: value, page: 1 });
  }
  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <Select
          aria-label="Sort ideas"
          value={query.sort}
          onChange={(value) => change("sort", value)}
          options={[
            { label: "Sort: Newest first", value: "newest" },
            { label: "Sort: Oldest first", value: "oldest" },
            { label: "Sort: Highest score", value: "score" },
          ]}
          className="sort-select"
        />
        {(module === "leads"
          ? ["priority", "product", "segment", "objective", "channel"]
          : ["product", "segment", "objective", "channel", "priority"]
        ).map((key) => {
          const values =
            key === "product"
              ? PRODUCTS
              : key === "channel"
              ? CHANNELS
              : key === "priority"
              ? ["High", "Medium", "Low"]
              : [
                  ...new Set(
                    ideas.map((idea) =>
                      key === "segment" ? idea.segment : idea.objective
                    )
                  ),
                ];
          const label = key[0].toUpperCase() + key.slice(1);
          return (
            <Select<string>
              key={key}
              aria-label={`Filter by ${key}`}
              value={String(query[key as keyof ListQuery] || "") || undefined}
              placeholder={`All ${label}`}
              allowClear
              onChange={(value) => change(key as keyof ListQuery, value ?? "")}
              options={options(values)}
              popupMatchSelectWidth={false}
              className={`filter-select filter-${key}`}
            />
          );
        })}
        {module !== "leads" && (
          <Checkbox
            checked={query.mine}
            onChange={(event) => change("mine", event.target.checked)}
          >
            {module === "community" ? "Created by me" : "Copied by me"}
          </Checkbox>
        )}
      </div>
      <Input
        key={module}
        className="idea-search"
        aria-label="Search ideas"
        prefix={<SearchOutlined />}
        placeholder="Search by title, keyword, product or segment…"
        defaultValue={query.search}
        allowClear
        onPressEnter={(event) => change("search", event.currentTarget.value)}
        onClear={() => change("search", "")}
      />
    </div>
  );
}
