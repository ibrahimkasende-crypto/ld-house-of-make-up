import { Icon, type IconName } from "./icons";

export function AdminHeader({
  kicker,
  title,
  icon,
  text,
}: {
  kicker: string;
  title: string;
  icon: IconName;
  text?: string;
}) {
  return (
    <header className="admin-head">
      <span className="admin-head-icon">
        <Icon name={icon} size={22} />
      </span>
      <div>
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {text ? <p className="admin-lead">{text}</p> : null}
      </div>
    </header>
  );
}

export function EmptyState({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="empty-state">
      <span className="admin-head-icon">
        <Icon name={icon} size={22} />
      </span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
