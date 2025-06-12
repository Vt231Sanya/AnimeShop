-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 12 2025 г., 07:58
-- Версия сервера: 9.1.0
-- Версия PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `anime_shop`
--

DELIMITER $$
--
-- Процедуры
--
DROP PROCEDURE IF EXISTS `GetOrdersByDate`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetOrdersByDate` (`p_start_date` DATE, `p_end_date` DATE)   BEGIN
    SELECT o.orders_id, o.order_date, o.total_amount, o.status, c.first_name, c.last_name
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.order_date BETWEEN p_start_date AND p_end_date;
END$$

DROP PROCEDURE IF EXISTS `GetProductsByCategoryAndPrice`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetProductsByCategoryAndPrice` (`p_category_name` NVARCHAR(45), `p_min_price` INT, `p_max_price` INT)   BEGIN
    SELECT p.product_id, p.name, p.price, cat.category_name
    FROM products p
    JOIN categories cat ON p.category_id = cat.category_id
    WHERE cat.category_name = p_category_name AND p.price BETWEEN p_min_price AND p_max_price;
END$$

DROP PROCEDURE IF EXISTS `GetReviewsByRating`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetReviewsByRating` (`p_min_rating` INT)   BEGIN
    SELECT r.review_id, c.first_name, c.last_name, r.rating, r.review_text, p.name AS product_name
    FROM reviews r
    JOIN customers c ON r.customer_id = c.customer_id
    JOIN products p ON r.product_id = p.product_id
    WHERE r.rating >= p_min_rating;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `unique_cart` (`customer_id`,`product_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `cart`
--

INSERT INTO `cart` (`cart_id`, `customer_id`, `product_id`, `quantity`) VALUES
(39, 19, 6, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int NOT NULL,
  `category_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Фігурки'),
(2, 'Постери'),
(3, 'Манга'),
(4, 'Стікери'),
(5, 'Аніме бокси');

-- --------------------------------------------------------

--
-- Структура таблицы `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `customers`
--

INSERT INTO `customers` (`customer_id`, `first_name`, `last_name`, `email`, `password`) VALUES
(1, 'Volodymyr', 'Zelenskyy', 'admin@potuzno.ua', '5269148852'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321'),
(3, 'Mike', 'Johnson', 'mike.johnson@example.com', '1122334455'),
(4, 'Sasha', 'Nahapetyan', 'Sasha@potuzno.ua', '1234'),
(18, 'Олександр', 'Нагапетян', 'test@potuzno.ua', '1234'),
(19, 'Олександр', 'Нагапетян', 'terrwrest@potuzno.ua', '1234');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `product_id`, `quantity`, `order_date`) VALUES
(1, 1, 1, 2, '2025-05-28 01:15:52'),
(2, 1, 2, 1, '2025-05-28 01:15:52'),
(3, 1, 1, 1, '2025-05-28 01:17:01'),
(4, 1, 4, 2, '2025-05-28 01:17:01'),
(5, 1, 1, 5, '2025-05-28 01:46:42'),
(6, 1, 3, 1, '2025-05-28 01:50:59'),
(7, 1, 12, 1, '2025-05-28 01:50:59'),
(8, 1, 1, 1, '2025-05-28 01:56:15'),
(9, 1, 2, 1, '2025-05-28 01:56:15'),
(10, 1, 3, 1, '2025-05-28 01:59:02'),
(11, 19, 3, 1, '2025-05-28 02:02:36'),
(12, 19, 1, 2, '2025-05-28 02:34:23'),
(13, 19, 2, 1, '2025-05-28 02:34:23'),
(14, 19, 6, 1, '2025-05-28 02:34:23'),
(15, 1, 4, 1, '2025-06-06 18:13:18'),
(16, 1, 2, 1, '2025-06-06 18:21:51'),
(17, 1, 3, 1, '2025-06-06 18:21:51'),
(18, 1, 5, 1, '2025-06-06 18:23:22'),
(19, 1, 1, 1, '2025-06-06 18:27:56'),
(20, 1, 4, 1, '2025-06-06 18:31:03'),
(21, 1, 5, 2, '2025-06-06 18:31:03'),
(22, 1, 6, 1, '2025-06-06 18:31:03'),
(23, 1, 11, 1, '2025-06-06 18:31:03'),
(24, 1, 16, 1, '2025-06-06 18:36:20'),
(26, 1, 2, 1, '2025-06-12 07:37:31'),
(27, 1, 3, 1, '2025-06-12 07:37:31'),
(28, 1, 6, 1, '2025-06-12 07:37:31');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` longtext,
  `price` int DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `image`, `category_id`, `discount`) VALUES
(1, 'Фігурка велика Jujutsu Kaisen Годжьо 32см', 'Виробник - SEGA\r\nСерія - FIGURIZM alpha\r\nВерсія - Kakusei (Awakening) \r\nДата випуску - липень 2024', 2500, 12, 'https://mascat-anime.com/storage/tmp_media/99/0ed/gallery_image-w592-h592-q100-resize-cp_d41_21980-qwp100.webp', 1, 10.00),
(2, 'Плакат А3 K On 03', 'Виробник: Україна\r\nМатериал: Папір\r\nРозмір: А3', 40, 34, 'https://mascat-anime.com/storage/tmp_media/ec/e40/gallery_image-w592-h592-q100-resize-cp_d41_19648-qwp100.webp', 2, 0.00),
(3, 'Манга Хорімія том 02', 'Старшокласниця Хорі — ефектна учениця, красуня та розумниця, проте вдома — проста, хазяйновита, дбає про молодшого брата, оскільки батьки занадто багато працюють. Вона зовсім немає часу на розваги й мандрівки, які так люблять її друзі.\r\n\r\nМіямура — тихий та відлюдькуватий однокласник, на якого ніхто не звертає уваги. А поза школою… Хорі скоро дізнається, що хлопець кардинально відрізнається від тієї лузерської маски, яку одягає в школі.\r\n\r\n«Хорімія» — манґа про юність із присмаком коли, від якої солодко стискає серце! Цікаво та дотепно про найважливіші проблеми шкільного життя, дружбу та самопізнання.', 200, 20, 'https://mascat-anime.com/storage/tmp_media/36/2d7/gallery_image-w592-h592-q100-resize-cp_d41_21956-qwp100.webp', 3, 15.00),
(4, 'Фігурка велика Sousou no Frieren Фрірен 18см', 'Виробник - Taito\r\nСерія - Coreful Figure\r\nДата випуску - серпень 2024', 1600, 3, 'https://mascat-anime.com/storage/tmp_media/bf/80f/gallery_image-w592-h592-q100-resize-cp_d41_21991-qwp100.webp', 1, 0.00),
(5, 'Стікерпак А4 Yakusoku no Neverland 02', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 16, 'https://mascat-anime.com/storage/tmp_media/68/80b/gallery_image-w592-h592-q100-resize-cp_d41_9525-qwp100.webp', 4, 0.00),
(6, 'Фігурка велика Genshin Impact Ху Тао 28см', 'Колекційна преміум фігрука Ху Тао з гри \"Геншин Імпакт\"!\r\n\r\nДівчина перебуває в позі своєї типової атаки; в руках у неї - посох Хоми. \r\n\r\nПідставка виконана у вигляді даху з елементами стихії Піро (вогонь).\r\n\r\nМатеріал - якісний ПВХ. Фігурка йде у великій міцній коробці.', 5300, 10, 'https://mascat-anime.com/storage/tmp_media/0d/261/gallery_image-w592-h592-q100-resize-cp_d41_15745-qwp100.webp', 1, 15.00),
(7, 'Стікерпак А4 Yarichin Bitch Club 01', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 29, 'https://mascat-anime.com/storage/tmp_media/45/16a/gallery_image-w592-h592-q100-resize-cp_d41_19693-qwp100.webp', 4, 0.00),
(8, 'Плакат А3 Tokyo Revengers 39', 'Виробник:\r\nУкраїна\r\nМатериал:\r\nПапір\r\nРозмір:\r\nА3', 40, 44, 'https://mascat-anime.com/storage/tmp_media/be/838/gallery_image-w592-h592-q100-resize-cp_d41_21555-qwp100.webp', 2, 5.00),
(9, 'Плакат А3 Genshin Impact 178', 'Виробник:\r\nУкраїна\r\nМатериал:\r\nПапір\r\nРозмір:\r\nА3', 40, 50, 'https://mascat-anime.com/storage/tmp_media/6d/1c4/gallery_image-w592-h592-q100-resize-cp_d41_22244-qwp100.webp', 2, 5.00),
(10, 'Стікерпак А4 Haikyuu 05', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 69, 'https://mascat-anime.com/storage/tmp_media/22/820/gallery_image-w592-h592-q100-resize-cp_d41_13368-qwp100.webp', 4, 0.00),
(11, 'Плакат А3 Dandadan 03', 'Виробник:\r\nУкраїна\r\nМатериал:\r\nПапір\r\nРозмір:\r\nА3', 40, 70, 'https://mascat-anime.com/storage/tmp_media/c8/b46/gallery_image-w592-h592-q100-resize-cp_d41_22341-qwp100.webp', 2, 0.00),
(12, 'Манга Синя тюрма том 02', 'Після програшу японської збірної на ЧС 2018 було розроблено спеціальний проект «Блю Лок» для «створення» найкращого та егоїстичного нападаючого. Щоб вижити в Синій в\'язниці, необхідно «пройтися трупами інших», адже виліт означає кінець усього футбольного життя... До кінця дійде лише 1 із 300 учасників.', 200, 48, 'https://mascat-anime.com/storage/tmp_media/73/c35/gallery_image-w592-h592-q100-resize-cp_d41_19538-qwp100.webp', 3, 40.00),
(13, 'Манга Фрірен том 01', 'Ельфійка-чарівниця Фрірен та її відважні побратими повертаються додому після переможної пригоди. Вони подолали Володаря демонів і принесли на ці землі мир… Але ельфійське життя незрівнянно довге, й зовсім скоро від команди героя Гіммеля нікого, крім Фрірен, не залишиться… Та чи здатна ельфійка, яка не знає, що таке старість, осягнути скінченність людського життя?\r\n\r\nДесятки років по тому Фрірен відвідує похорон одного зі своїх друзів і, спустошена, замислюється: що ж насправді вона знає про рід людський? Чи її доля — вічний сум за тими, хто вже не поруч? Чи вона має унікальну можливість ушанувати їхні історії? Фрірен вирішує дізнатися більше про своїх друзів, і так починається нова пригода — ностальгічна подорож уторованими стежками…', 220, 12, 'https://mascat-anime.com/storage/tmp_media/cd/a86/gallery_image-w592-h592-q100-resize-cp_d41_21638-qwp100.webp', 3, 0.00),
(14, 'Манга Нана том 07', 'Доля звела двох дівчат у поїзді в Токіо, одна їхала до свого хлопця, друга прямувала до столиці, щоби стати відомою співачкою. Будучи тезками, дівчата швидко знаходять спільну мову, навіть попри протилежність характерів. Після приїзду одна з дівчат біжить до свого хлопця і втрачає з поля зору другу, не взявши навіть номер телефону. Доля грає їм на користь, і вони знову перетинаються на перегляді квартири.', 250, 23, 'https://mascat-anime.com/storage/tmp_media/a9/13b/gallery_image-w592-h592-q100-resize-cp_d41_17312-qwp100.webp', 3, 0.00),
(15, 'Стікерпак А4 K On 01', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 100, 'https://mascat-anime.com/storage/tmp_media/5d/30b/gallery_image-w592-h592-q100-resize-cp_d41_19794-qwp100.webp', 4, 0.00),
(16, 'Фігурка велика Evangelion Аска 38см', 'Колекційна фігурка Аски заввишки аж 38см (висота самої Аски 28см + спис) в її знаковому костюмі та пов\'язкою на оці.\r\n\r\nВерсія з повнометражного фільму \"Євангеліон 3.0. Ти (не) виправиш\".\r\n\r\nПідставка також йде з підписом версії. Матеріал - високоякісний ПВХ.', 4200, 3, 'https://mascat-anime.com/storage/tmp_media/ab/a-e/gallery_image-w592-h592-q100-resize-cp_d41_15736-qwp100.webp', 1, 0.00),
(18, 'Test', 'Cat', 200, 0, 'https://i.pinimg.com/736x/c9/9c/45/c99c4584215b87f421693f8019cfef1d.jpg', 1, 0.00),
(23, 'Фігурка велика Sousou no Frieren Фрірен бал 1', 'Фігурка неперевершеної чарівниці Фрірен з серії Luminasta від Sega із серії «Бал у Форліха». \nЕльфійка одягнута у красиве бальне плаття, та має незвичну для себе, але дуже гарну зачіску. \nМоже бути в коллекції як самостійна фігурка, так і в парі зі своім компаньоном Гіммелем. \n\n \n\nВиробник - SEGA\nСерія - Luminasta\nВерсія - Ball At Forlich\nДата випуску - листопад 2024', 2500, 5, 'https://mascat-anime.com/storage/tmp_media/8c/d81/gallery_image-w592-h592-q100-resize-cp_d41_22651-qwp100.webp', 1, 0.00),
(24, 'Фігурка велика Sousou no Frieren Юбел 18см', 'Юбель маг першого класу і та сама порушниця порядку, яка брала участь у іспиті на мага, що і Ферн з Фрірен. \nОдягнена у свій кононічний образ. Вона чудово впишеться у будь-яку аніме колекцію.✌️\n\n \n\nВиробник - SEGA\nСерія - Desktop×Decorate Collections\nДата випуску - жовтень 2024', 2500, 4, 'https://mascat-anime.com/storage/tmp_media/c5/f3c/gallery_image-w592-h592-q100-resize-cp_d41_22654-qwp100.webp', 1, 0.00),
(25, 'Фігурка велика Hunter x Hunter Гон 12см', 'Гон - мисливець-новачок, головний герой аніме \"Hunter x Hunter\". Він син знаменитого Мисливця, якого Гон хоче знайти.\nФігурка демонструе Гона під час використання техніки яку він створив сам - Камінь-ножиці-папір (ДжаДжанКен), що включає одночасне використання відразу декількох технік.\nЦя фігурка чудово впишеться на твою полочку чи стіл, та стане чудовим  доповненям колекції. \n\n \n\nВиробник - Bandai Spirits \nСерія - Vibration Stars II\nДата випуску - листопад 2024', 1750, 10, 'https://mascat-anime.com/storage/tmp_media/45/fb5/gallery_image-w592-h592-q100-resize-cp_d41_22671-qwp100.webp', 1, 30.00),
(26, 'Фігурка велика Hunter x Hunter Кілуа 15см', 'Виробник - Bandai Spirits \nСерія - Vibration Stars\nДата випуску - серпень 2024', 2500, 8, 'https://mascat-anime.com/storage/tmp_media/aa/262/gallery_image-w592-h592-q100-resize-cp_d41_22673-qwp100.webp', 1, 0.00),
(27, 'Фігурка велика Hunter x Hunter Курапіка 20см', 'Один із четвірки головних протагоністів та останній з клану Куруто - носій червоних очей.\nФігурка демонструе здатність курапіки активувати ланцюг з кігтем на кінці, що кріпиться до середнього пальця. Цей ланцюг, обмотує суперника. Завдяки посиленню ланцюг не можна розірвати людськими силами без допомоги Нен.\nЦя фігурка чудово впишеться на твою полочку чи стіл, та стане чудовим  доповненям колекції.\n\n \n\nВиробник - Bandai Spirits \nСерія - Vibration Stars\nДата випуску - вересень 2024', 2500, 9, 'https://mascat-anime.com/storage/tmp_media/cd/c5a/gallery_image-w592-h592-q100-resize-cp_d41_22672-qwp100.webp', 1, 0.00),
(28, 'Манга Хорімія том 04 (укр)', 'У стінах школи Міямура здається типовим відмінником-інтровертом. Хто б міг подумати, що його шлях перетнеться з Хорі - зіркою школи та душею компанії? \nАле доля підготувала сюрприз. Випадковість розкрила їхні справжні особистості: під скромним образом Міямури ховається бунтар з татуюваннями, а енергійна Хорі виявилася турботливою домогосподаркою.\nВідкривши одне одного з несподіваного боку, двоє \nоднокласників знаходять спільну мову та зближуються.', 220, 25, 'https://mascat-anime.com/storage/tmp_media/2d/936/gallery_image-w592-h592-q100-resize-cp_d41_22761-qwp100.webp', 3, 0.00),
(29, 'Манга Пять наречених близнят том 04 (укр)', 'Відмінник Футаро, який конче потребує грошей, отримує пропозицію: стати репетитором дочок бізнесмена за щедру платню. Погодившись без зайвих питань, він дізнається, що його учениці - п’ятеро сестер-близнючок, зовні схожих, але з дуже різними характерами.\nДівчата ледачі та байдужі до навчання, але хлопець наполегливо намагається знайти підхід до кожної. З часом сестри відчувають, що хтось нарешті бачить у них унікальних особистостей. Це розпалює суперництво за увагу Футаро. \nУ підсумку одна з них таки змогла завоювати його серце. Вгадай, читаючи, хто саме?', 200, 52, 'https://mascat-anime.com/storage/tmp_media/d4/b00/gallery_image-w592-h592-q100-resize-cp_d41_22695-qwp100.webp', 3, 0.00),
(30, 'Манга Самітниця рокерка! том 03 (укр)', 'Хіторі Ґото — старшокласниця з мрією про рок-музику та справжніх друзів, але її соціофобія стоїть на заваді цим прагненням.\nКоли доля дарує їй шанс приєднатися до гурту «Кессоку Бандо» та вперше виступити на сцені, перед дівчиною постає випробування: чи зможе вона побороти свої страхи та знайти в собі сили зробити крок назустріч мрії? \nЦе історія про пошук внутрішньої сили та те, як юна дівчина долає власні страхи та вчиться розмовляти з людьми. ', 230, 64, 'https://mascat-anime.com/storage/tmp_media/38/671/gallery_image-w592-h592-q100-resize-cp_d41_22605-qwp100.webp', 3, 0.00),
(31, 'Манга Синя тюрма том 05 (укр)', 'Японська футбольна збірна переживає системну кризу. Після чергової невдачі на міжнародній арені країна опинилася перед необхідністю кардинальних змін. \nФутбольний союз вирішив запросити харизматичного тренера Джимпачі Его для реалізації унікального проекту \"Синя Тюрьма\". Його мета- відібрати серед трьохсот молодих нападників єдиного чемпіона. Йоїчі Ісагі, один з учасників, бачить у цьому шанс здійснити свою мрію стати найкращим футболістом Японії.\nУчасників чекають виснажливі тренування та психологічні випробування. Кожен момент може стати переломним у боротьбі за місце в національній збірній.', 220, 34, 'https://mascat-anime.com/storage/tmp_media/f9/495/gallery_image-w592-h592-q100-resize-cp_d41_22386-qwp100.webp', 3, 0.00),
(32, 'Манга Самітниця рокерка! том 02 (укр)', 'Хіторі Ґото — старшокласниця з мрією про рок-музику та справжніх друзів, але її соціофобія стоїть на заваді цим прагненням.\nКоли доля дарує їй шанс приєднатися до гурту «Кессоку Бандо» та вперше виступити на сцені, перед дівчиною постає випробування: чи зможе вона побороти свої страхи та знайти в собі сили зробити крок назустріч мрії? \nЦе історія про пошук внутрішньої сили та те, як юна дівчина долає власні страхи та вчиться розмовляти з людьми.', 230, 52, 'https://mascat-anime.com/storage/tmp_media/13/9ea/gallery_image-w592-h592-q100-resize-cp_d41_21802-qwp100.webp', 3, 0.00),
(33, 'Стікерпак А5 Bungou Stray Dogs 01 прорізний', 'Стікери прорізні. Вирізати самостійно НЕ потрібно. Тримаються добре на усіх поверхнях крім \"ребристих\" включаючи телефон, ноутбук та папір.\nНемає покриття, захищающого від води.', 40, 34, 'https://mascat-anime.com/storage/tmp_media/0f/779/gallery_image-w592-h592-q100-resize-cp_d41_22909-qwp100.webp', 4, 50.00),
(34, 'Стікерпак А5 Evangelion 01 прорізний', 'Стікери прорізні. Вирізати самостійно НЕ потрібно. Тримаються добре на усіх поверхнях крім \"ребристих\" включаючи телефон, ноутбук та папір.\nНемає покриття, захищающого від води.', 80, 23, 'https://mascat-anime.com/storage/tmp_media/8d/ec1/gallery_image-w592-h592-q100-resize-cp_d41_22910-qwp100.webp', 4, 0.00),
(35, 'Стікерпак А5 Jujutsu Kaisen 01 прорізний', 'Стікери прорізні. Вирізати самостійно НЕ потрібно. Тримаються добре на усіх поверхнях крім \"ребристих\" включаючи телефон, ноутбук та папір.\nНемає покриття, захищающого від води.', 80, 12, 'https://mascat-anime.com/storage/tmp_media/e0/824/gallery_image-w592-h592-q100-resize-cp_d41_22911-qwp100.webp', 4, 0.00),
(36, 'Стікерпак А4 Hunter x Hunter 02', 'Стікери з аркуша потрібно вирізати самостійно. Тримаються добре на усіх поверхнях крім \"ребристих\" включаючи телефон, ноутбук та папір.\nНемає покриття, захищающого від води.', 40, 64, 'https://mascat-anime.com/storage/tmp_media/e7/097/gallery_image-w592-h592-q100-resize-cp_d41_22562-qwp100.webp', 4, 0.00),
(37, 'Стікерпак А5 Vocaloid 01 прорізний', 'Стікери прорізні. Вирізати самостійно НЕ потрібно. Тримаються добре на усіх поверхнях крім \"ребристих\" включаючи телефон, ноутбук та папір.\nНемає покриття, захищающого від води.', 80, 36, 'https://mascat-anime.com/storage/tmp_media/63/95d/gallery_image-w592-h592-q100-resize-cp_d41_22916-qwp100.webp', 4, 0.00),
(38, 'Плакат А3 Vocaloid 117', 'Плакат з принтом, на якому точно передані всі кольори й відтінки.\nМатеріал - щільний мелований папір, гарно витримає різні кріплення (скотчем або голками/кнопками)', 40, 74, 'https://mascat-anime.com/storage/tmp_media/92/d69/gallery_image-w592-h592-q100-resize-cp_d41_23312-qwp100.webp', 2, 0.00),
(39, 'Плакат А3 Sousou no Frieren 19', 'Плакат з принтом, на якому точно передані всі кольори й відтінки.\nМатеріал - щільний мелований папір, гарно витримає різні кріплення (скотчем або голками/кнопками)', 40, 54, 'https://mascat-anime.com/storage/tmp_media/14/5c5/gallery_image-w592-h592-q100-resize-cp_d41_23383-qwp100.webp', 2, 0.00),
(40, 'Плакат А3 Re Zero 55', 'Плакат з принтом, на якому точно передані всі кольори й відтінки.\nМатеріал - щільний мелований папір, гарно витримає різні кріплення (скотчем або голками/кнопками)', 36, 23, 'https://mascat-anime.com/storage/tmp_media/d2/1ca/gallery_image-w592-h592-q100-resize-cp_d41_15880-qwp100.webp', 2, 10.00),
(41, 'Плакат А3 SAO 37', 'Плакат з принтом, на якому точно передані всі кольори й відтінки.\nМатеріал - щільний мелований папір, гарно витримає різні кріплення (скотчем або голками/кнопками)', 40, 23, 'https://mascat-anime.com/storage/tmp_media/e6/bc2/gallery_image-w592-h592-q100-resize-cp_d41_8000-qwp100.webp', 2, 0.00),
(42, 'Плакат А3 Hunter x Hunter 47', 'Плакат з принтом, на якому точно передані всі кольори й відтінки.\nМатеріал - щільний мелований папір, гарно витримає різні кріплення (скотчем або голками/кнопками)', 40, 65, 'https://mascat-anime.com/storage/tmp_media/f6/28b/gallery_image-w592-h592-q100-resize-cp_d41_23420-qwp100.webp', 2, 0.00),
(43, 'Аніме бокс стандарт Sailor Moon', 'Аніме-бокс - це ідеальний подарунок для кожного анімешника❤️\nМерч з улюбленими героями, одразу спакований в гарненьку коробочку - купуй та даруй одразу!\nА щоб було ще приємніше - на готовий бокс ти отримуєш знижку від 80 до 200грн)\n\nУ середині цього боксу ти знайдеш:\n- брелок дакімакура\n- значок\n- магніт А7\n- стікерпак А4\n- фігурка чібік\n- чашка 330мл\n- брелок фігурка \n- анімешна коробочка.\nАкційний товар - додаткові знижки та промокоди НЕ працюють\nНе підлягають поверненню або обміну!', 920, 3, 'https://mascat-anime.com/storage/tmp_media/85/3f3/gallery_image-w592-h592-q100-resize-cp_d41_23236-qwp100.webp', 5, 23.00),
(44, 'Аніме бокс стандарт Fullmetal Alchemist', 'Аніме-бокс - це ідеальний подарунок для кожного анімешника❤️\nМерч з улюбленими героями, одразу спакований в гарненьку коробочку - купуй та даруй одразу!\n\nА щоб було ще приємніше - на готовий бокс ти отримуєш знижку від 80 до 200грн)\n\nУ середині цього боксу ти знайдеш:\n- брелок дакімакура\n- гобелен 23х70см\n- значок 2шт.\n- магніт А7\n- скетчбук 24арк\n- стікерпак А4\n- акрилова фігурка 15см\n- анімешна коробочка.\n\nАкційний товар - додаткові знижки та промокоди НЕ працюють\nНе підлягають поверненню або обміну!', 945, 54, 'https://mascat-anime.com/storage/tmp_media/31/df6/gallery_image-w592-h592-q100-resize-cp_d41_23238-qwp100.webp', 5, 10.00),
(45, 'Аніме бокс стандарт Darling in the FranXX', 'Аніме-бокс - це ідеальний подарунок для кожного анімешника❤️\nМерч з улюбленими героями, одразу спакований в гарненьку коробочку - купуй та даруй одразу!\n\nА щоб було ще приємніше - на готовий бокс ти отримуєш знижку від 80 до 200грн)\n\nУ середині цього боксу ти знайдеш:\n- брелок дакімакура\n- гобелен 23х70см\n- значок\n- набір із листівки та прорізаних стікерів\n- магніт А7\n- стікерпак А4\n- акрилова фігурка 6см\n- чашка 330мл\n- анімешна коробочка.\n\nАкційний товар - додаткові знижки та промокоди НЕ працюють\nНе підлягають поверненню або обміну!', 950, 4, 'https://mascat-anime.com/storage/tmp_media/09/ca0/gallery_image-w592-h592-q100-resize-cp_d41_23235-qwp100.webp', 5, 0.00),
(46, 'Аніме бокс преміум Yakusoku no Neverland', 'Аніме-бокс - це ідеальний подарунок для кожного анімешника❤️\nМерч з улюбленими героями, одразу спакований в гарненьку коробочку - купуй та даруй одразу!\n \nА щоб було ще приємніше - на готовий бокс ти отримуєш знижку від 80 до 200грн)\n \nУ середині цього боксу ти знайдеш: \n- брелок дакімакура\n- гобелен 23х70см\n- значок 2шт.\n- магніт А7\n- плакат А3 2шт.\n- скетчбук 24арк\n- стікерпак А4\n- сумка-шопер\n- фігурка чібік\n- чашка 330мл\n- анімешна коробочка.\n\nАкційний товар - додаткові знижки та промокоди НЕ працюють\nНе підлягають поверненню або обміну!', 1545, 6, 'https://mascat-anime.com/storage/tmp_media/12/f58/gallery_image-w592-h592-q100-resize-cp_d41_23243-qwp100.webp', 5, 15.00);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `rating` int DEFAULT NULL,
  `review_text` longtext,
  `review_date` date DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`review_id`, `rating`, `review_text`, `review_date`, `product_id`, `customer_id`) VALUES
(14, 5, 'Відгук', '2025-06-12', 6, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE IF NOT EXISTS `wishlists` (
  `wishlist_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `wishlists`
--

INSERT INTO `wishlists` (`wishlist_id`, `customer_id`, `product_id`) VALUES
(32, 19, 2),
(34, 19, 1),
(38, 1, 2),
(40, 1, 27),
(41, 1, 31),
(42, 1, 44);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
