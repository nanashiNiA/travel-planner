import { PreferenceForm } from "@/components/preferences/preference-form";

export default function PreferencesPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">旅行の好み設定</h1>
        <p className="text-sm text-muted-foreground">
          あなたの好みを登録すると、プラン提案がよりパーソナライズされます
        </p>
      </div>
      <PreferenceForm />
    </div>
  );
}
