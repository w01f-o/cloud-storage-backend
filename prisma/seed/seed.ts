import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

const seed = async (): Promise<void> => {
  const createBaseUser = async (): Promise<void> => {
    const EMAIL = 'safe@cloud.ru';
    const PASSWORD = await hash('safecloud');
    const USER_NAME = 'Safe Cloud';
    const FOLDERS_COUNT = 150;

    const isExists = await prisma.user.findUnique({
      where: { email: EMAIL },
      select: { id: true },
    });

    if (isExists) return;

    const user = await prisma.user.create({
      data: {
        email: EMAIL,
        name: USER_NAME,
        password: PASSWORD,
      },
    });

    const COLORS: string[] = [
      '#EEF7FE',
      '#FFFBEC',
      '#FEEEEE',
      '#F0FFFF',
      '#E6F7E6',
      '#FFF0F5',
      '#F5F5DC',
      '#F0F8FF',
      '#FFFACD',
      '#F5FFFA',
      '#FDF5E6',
      '#F8F8FF',
      '#E0FFFF',
      '#FAFAD2',
      '#FFE4E1',
      '#F3F3F3',
      '#EAEAEA',
      '#FFF8DC',
      '#F9F9F9',
      '#FFEFD5',
      '#F0FFF0',
      '#F5F5F5',
      '#FFFFF0',
      '#FFF5EE',
      '#F6F8FA',
      '#F7FAFC',
      '#FCFCFC',
      '#F4F4F4',
      '#F9FBFD',
      '#F2F2F2',
    ];
    const FOLDER_NAMES = [
      'Документы',
      'Фотографии',
      'Музыка',
      'Видео',
      'Работа',
      'Учёба',
      'Путешествия',
      'Рецепты',
      'Проекты',
      'Архив',
      'Сканы',
      'Бухгалтерия',
      'Семья',
      'Идеи',
      'Книги',
      'Заметки',
      'Пароли',
      'Договоры',
      'Разное',
      'Старое',
      'Налоги',
      'Медицина',
      'Дом',
      'Авто',
      'Курсы',
      'Финансы',
      'Письма',
      'Сертификаты',
      'Фото с отпуска',
      'Музыкальные проекты',
      'Платежки',
      'Счета',
      'ЖКХ',
      'Снимки экрана',
      'Техника',
      'Гарантии',
      'Референсы',
      'Вдохновение',
      'Презентации',
      'Шаблоны',
      'Рабочие файлы',
      'Учебные материалы',
      'Записи звонков',
      'Аудиозаписи',
      'Видеоуроки',
      'Планы',
      'Цели',
      'Отчёты',
      'Заявки',
      'Логи',
      'Бэкапы',
      'Резервные копии',
      'Игры',
      'Сохранения',
      'Клиенты',
      'Поставщики',
      'Партнёры',
      'Контракты',
      'Маркетинг',
      'Брендинг',
      'SEO',
      'Сайт',
      'Контент',
      'Посты',
      'Соцсети',
      'Видеоархив',
      'Финансовые отчёты',
      'Инвестиции',
      'Крипта',
      'Портфолио',
      'Тесты',
      'Экзамены',
      'Задания',
      'Справки',
      'Полисы',
      'Страхование',
      'Медкарта',
      'Журнал',
      'Дневник',
      'Личное',
      'Секретное',
      'Черновики',
    ];

    const folders: Prisma.FolderCreateManyInput[] = Array.from(
      { length: FOLDERS_COUNT },
      (_, index) => ({
        name: FOLDER_NAMES[index % FOLDER_NAMES.length],
        color: COLORS[index % COLORS.length],
        userId: user.id,
      })
    );

    await prisma.folder.createMany({ data: folders, skipDuplicates: true });
  };

  try {
    await prisma.$connect();

    await createBaseUser();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
