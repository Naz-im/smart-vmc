import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';

/**
 * @class NotificationService
 * @brief Service pour gérer les notifications locales
 * @details
 * Ce service utilise la bibliothèque Notifee pour :
 * - Demander la permission d'envoyer des notifications
 * - Créer un canal de notification pour les alertes VMC
 * - Afficher des notifications locales avec un titre et un corps
 */
class NotificationService {
  
  /**
   * @function requestPermission
   * @brief Demande la permission d'envoyer des notifications
   * @returns {Promise<boolean>} Vrai si la permission est accordée, sinon faux
   */
  async requestPermission() {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  }

  /**
   * @function createChannel
   * @brief Crée un canal de notification pour les alertes VMC
   * @returns {Promise<string>} L'ID du canal créé
   */
  async createChannel() {
    return await notifee.createChannel({
      id: 'vmc-alerts',
      name: 'Alertes VMC',
      importance: AndroidImportance.HIGH,
    });
  }

  /**
   * @function displayNotification
   * @brief Affiche une notification locale avec le titre et le corps spécifiés
   * @param {string} title - Le titre de la notification
   * @param {string} body - Le corps de la notification
   */
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