import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({ datetime, size = "sm", className }: Props) {
  return (
    <div className={`flex items-center ${className ?? ""}`}>
      <span className="sr-only">Published on:</span>
      <span className={size === "sm" ? "text-xs" : "text-sm opacity-80"}>
        <FormattedDatetime datetime={datetime} size={size} />
      </span>
    </div>
  );
}

const FormattedDatetime = ({
  datetime,
  size,
}: {
  datetime: string | Date;
  size: "sm" | "lg";
}) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: size === "sm" ? "short" : "long",
    day: "numeric",
  });

  return <>{date}</>;
};
