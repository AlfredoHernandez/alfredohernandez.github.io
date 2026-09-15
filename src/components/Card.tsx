import Datetime from "./Datetime";
import type { BlogFrontmatter } from "@content/_schemas";

export interface Props {
  href?: string;
  frontmatter: BlogFrontmatter;
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, description, tags } = frontmatter;
  const headingClass =
    "font-display text-lg font-bold leading-snug group-hover:text-skin-accent";
  return (
    <li className="card group">
      <a href={href} className="flex h-full flex-col gap-2.5 p-5">
        <div className="flex items-center gap-2 text-xs opacity-70">
          <Datetime datetime={pubDatetime} />
          <span aria-hidden="true">·</span>
          <span>{tags[0]?.toLowerCase()}</span>
        </div>
        {secHeading ? (
          <h2 className={headingClass}>{title}</h2>
        ) : (
          <h3 className={headingClass}>{title}</h3>
        )}
        <p className="text-sm leading-relaxed opacity-80">{description}</p>
      </a>
    </li>
  );
}
