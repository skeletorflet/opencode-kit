import type { Plugin } from "@opencode-ai/plugin";

export const NotificationPlugin: Plugin = async ({ $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        const psScript = [
          "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null;",
          "[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType=WindowsRuntime] | Out-Null;",
          "$t = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02);",
          "$n = $t.GetElementsByTagName('text');",
          "$n[0].AppendChild($t.CreateTextNode('OpenCode')) | Out-Null;",
          "$n[1].AppendChild($t.CreateTextNode('Session is now idle.')) | Out-Null;",
          "$notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('OpenCode');",
          "$notifier.Show([Windows.UI.Notifications.ToastNotification]::new($t));",
        ].join(" ");

        await $`powershell -NoProfile -NonInteractive -WindowStyle Hidden -Command ${psScript}`.quiet();
      }
    },
  };
};
