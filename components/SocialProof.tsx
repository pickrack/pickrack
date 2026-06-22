import { Github, Users, Zap, FileText } from "lucide-react";

export default function SocialProof() {
  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Active users",
    },
    {
      icon: Zap,
      value: "2.1M",
      label: "Tools run monthly",
    },
    {
      icon: FileText,
      value: "76",
      label: "Free tools",
    },
    {
      icon: Github,
      value: "Open",
      label: "Discussions on GitHub",
    },
  ];

  return (
    <section className="py-10 border-t border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx}>
              <div className="flex justify-center mb-2">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
