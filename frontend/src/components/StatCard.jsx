function StatCard({
  title,
  value,
  subtitle,
  icon,
  type,
}) {
  return (
    <div className="stat-card">

      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-info">
        <span>{title}</span>

        <h3>{value}</h3>

        <small>{subtitle}</small>
      </div>

    </div>
  );
}

export default StatCard;