import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';

class NotificationService {
  
  async requestPermission() {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  }

  async createChannel() {
    return await notifee.createChannel({
      id: 'vmc-alerts',
      name: 'Alertes VMC',
      importance: AndroidImportance.HIGH,
    });
  }

  async displayNotification(title: string, body: string) {
    const channelId = await this.createChannel();

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

export default new NotificationService();