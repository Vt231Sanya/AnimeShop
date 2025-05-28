-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 28 2025 г., 03:09
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
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `cart`
--

INSERT INTO `cart` (`cart_id`, `customer_id`, `product_id`, `quantity`) VALUES
(33, 1, 7, 1),
(34, 1, 4, 1),
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Фігурки'),
(2, 'Постери'),
(3, 'Манга'),
(4, 'Стікери');

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
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `customers`
--

INSERT INTO `customers` (`customer_id`, `first_name`, `last_name`, `email`, `password`) VALUES
(1, 'Volodymyr', 'Zelenskyy', 'admin@potuzno.ua', '5269148852'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321'),
(3, 'Mike', 'Johnson', 'mike.johnson@example.com', '1122334455'),
(4, 'Sasha', 'Nahapetyan', 'Sasha@potuzno.ua', '1234'),
(19, 'Олександр', 'Нагапетян', 'terrwrest@potuzno.ua', '1234'),
(18, 'Олександр', 'Нагапетян', 'test@potuzno.ua', '1234');

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
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(14, 19, 6, 1, '2025-05-28 02:34:23');

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
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `image`, `category_id`, `discount`) VALUES
(1, 'Фігурка велика Jujutsu Kaisen Годжьо 32см', 'Виробник - SEGA\r\nСерія - FIGURIZM alpha\r\nВерсія - Kakusei (Awakening) \r\nДата випуску - липень 2024', 2500, 13, 'https://mascat-anime.com/storage/tmp_media/99/0ed/gallery_image-w592-h592-q100-resize-cp_d41_21980-qwp100.webp', 1, 10.00),
(2, 'Плакат А3 K On 03', 'Виробник: Україна\r\nМатериал: Папір\r\nРозмір: А3', 40, 36, 'https://mascat-anime.com/storage/tmp_media/ec/e40/gallery_image-w592-h592-q100-resize-cp_d41_19648-qwp100.webp', 2, 0.00),
(3, 'Манга Хорімія том 02', 'Старшокласниця Хорі — ефектна учениця, красуня та розумниця, проте вдома — проста, хазяйновита, дбає про молодшого брата, оскільки батьки занадто багато працюють. Вона зовсім немає часу на розваги й мандрівки, які так люблять її друзі.\r\n\r\nМіямура — тихий та відлюдькуватий однокласник, на якого ніхто не звертає уваги. А поза школою… Хорі скоро дізнається, що хлопець кардинально відрізнається від тієї лузерської маски, яку одягає в школі.\r\n\r\n«Хорімія» — манґа про юність із присмаком коли, від якої солодко стискає серце! Цікаво та дотепно про найважливіші проблеми шкільного життя, дружбу та самопізнання.', 200, 22, 'https://mascat-anime.com/storage/tmp_media/36/2d7/gallery_image-w592-h592-q100-resize-cp_d41_21956-qwp100.webp', 3, 0.00),
(4, 'Фігурка велика Sousou no Frieren Фрірен 18см', 'Виробник - Taito\r\nСерія - Coreful Figure\r\nДата випуску - серпень 2024', 1600, 5, 'https://mascat-anime.com/storage/tmp_media/bf/80f/gallery_image-w592-h592-q100-resize-cp_d41_21991-qwp100.webp', 1, 0.00),
(5, 'Стікерпак А4 Yakusoku no Neverland 02', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 19, 'https://mascat-anime.com/storage/tmp_media/68/80b/gallery_image-w592-h592-q100-resize-cp_d41_9525-qwp100.webp', 4, 0.00),
(7, 'Стікерпак А4 Yarichin Bitch Club 01', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 29, 'https://mascat-anime.com/storage/tmp_media/45/16a/gallery_image-w592-h592-q100-resize-cp_d41_19693-qwp100.webp', 4, 0.00),
(8, 'Плакат А3 Tokyo Revengers 39', 'Виробник:\r\nУкраїна\r\nМатериал:\r\nПапір\r\nРозмір:\r\nА3', 40, 44, 'https://mascat-anime.com/storage/tmp_media/be/838/gallery_image-w592-h592-q100-resize-cp_d41_21555-qwp100.webp', 2, 5.00),
(9, 'Плакат А3 Genshin Impact 178', 'Виробник:\r\nУкраїна\r\nМатериал:\r\nПапір\r\nРозмір:\r\nА3', 40, 50, 'https://mascat-anime.com/storage/tmp_media/6d/1c4/gallery_image-w592-h592-q100-resize-cp_d41_22244-qwp100.webp', 2, 5.00),
(10, 'Стікерпак А4 Haikyuu 05', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 69, 'https://mascat-anime.com/storage/tmp_media/22/820/gallery_image-w592-h592-q100-resize-cp_d41_13368-qwp100.webp', 4, 0.00),
(11, 'Плакат А3 Dandadan 03', 'Виробник:\r\nУкраїна\r\nМатериал:\r\nПапір\r\nРозмір:\r\nА3', 40, 71, 'https://mascat-anime.com/storage/tmp_media/c8/b46/gallery_image-w592-h592-q100-resize-cp_d41_22341-qwp100.webp', 2, 0.00),
(12, 'Манга Синя тюрма том 02', 'Після програшу японської збірної на ЧС 2018 було розроблено спеціальний проект «Блю Лок» для «створення» найкращого та егоїстичного нападаючого. Щоб вижити в Синій в\'язниці, необхідно «пройтися трупами інших», адже виліт означає кінець усього футбольного життя... До кінця дійде лише 1 із 300 учасників.', 200, 48, 'https://mascat-anime.com/storage/tmp_media/73/c35/gallery_image-w592-h592-q100-resize-cp_d41_19538-qwp100.webp', 3, 40.00),
(13, 'Манга Фрірен том 01', 'Ельфійка-чарівниця Фрірен та її відважні побратими повертаються додому після переможної пригоди. Вони подолали Володаря демонів і принесли на ці землі мир… Але ельфійське життя незрівнянно довге, й зовсім скоро від команди героя Гіммеля нікого, крім Фрірен, не залишиться… Та чи здатна ельфійка, яка не знає, що таке старість, осягнути скінченність людського життя?\r\n\r\nДесятки років по тому Фрірен відвідує похорон одного зі своїх друзів і, спустошена, замислюється: що ж насправді вона знає про рід людський? Чи її доля — вічний сум за тими, хто вже не поруч? Чи вона має унікальну можливість ушанувати їхні історії? Фрірен вирішує дізнатися більше про своїх друзів, і так починається нова пригода — ностальгічна подорож уторованими стежками…', 220, 12, 'https://mascat-anime.com/storage/tmp_media/cd/a86/gallery_image-w592-h592-q100-resize-cp_d41_21638-qwp100.webp', 3, 0.00),
(14, 'Манга Нана том 07', 'Доля звела двох дівчат у поїзді в Токіо, одна їхала до свого хлопця, друга прямувала до столиці, щоби стати відомою співачкою. Будучи тезками, дівчата швидко знаходять спільну мову, навіть попри протилежність характерів. Після приїзду одна з дівчат біжить до свого хлопця і втрачає з поля зору другу, не взявши навіть номер телефону. Доля грає їм на користь, і вони знову перетинаються на перегляді квартири.', 250, 23, 'https://mascat-anime.com/storage/tmp_media/a9/13b/gallery_image-w592-h592-q100-resize-cp_d41_17312-qwp100.webp', 3, 0.00),
(15, 'Стікерпак А4 K On 01', 'Не прорізні, картинки потрібно вирізати самостійно.', 40, 100, 'https://mascat-anime.com/storage/tmp_media/5d/30b/gallery_image-w592-h592-q100-resize-cp_d41_19794-qwp100.webp', 4, 0.00),
(16, 'Фігурка велика Evangelion Аска 38см', 'Колекційна фігурка Аски заввишки аж 38см (висота самої Аски 28см + спис) в її знаковому костюмі та пов\'язкою на оці.\r\n\r\nВерсія з повнометражного фільму \"Євангеліон 3.0. Ти (не) виправиш\".\r\n\r\nПідставка також йде з підписом версії. Матеріал - високоякісний ПВХ.', 4200, 4, 'https://mascat-anime.com/storage/tmp_media/ab/a-e/gallery_image-w592-h592-q100-resize-cp_d41_15736-qwp100.webp', 1, 0.00),
(6, 'Фігурка велика Genshin Impact Ху Тао 28см', 'Колекційна преміум фігрука Ху Тао з гри \"Геншин Імпакт\"!\r\n\r\nДівчина перебуває в позі своєї типової атаки; в руках у неї - посох Хоми. \r\n\r\nПідставка виконана у вигляді даху з елементами стихії Піро (вогонь).\r\n\r\nМатеріал - якісний ПВХ. Фігурка йде у великій міцній коробці.', 5300, 2, 'https://mascat-anime.com/storage/tmp_media/0d/261/gallery_image-w592-h592-q100-resize-cp_d41_15745-qwp100.webp', 1, 15.00),
(17, 'Update test', 'Update', 250, 7, 'https://i.pinimg.com/736x/c9/9c/45/c99c4584215b87f421693f8019cfef1d.jpg', 1, 0.00),
(18, 'Test', 'Cat', 200, 0, 'https://i.pinimg.com/736x/c9/9c/45/c99c4584215b87f421693f8019cfef1d.jpg', 1, 0.00),
(20, 'Test', 'Cat', 200, 5, 'https://i.pinimg.com/736x/c9/9c/45/c99c4584215b87f421693f8019cfef1d.jpg', 1, 0.00),
(21, NULL, NULL, NULL, NULL, NULL, NULL, 0.00),
(22, 'товар', 'asd', 69, 52, 'https://i.pinimg.com/736x/c3/01/36/c30136616396c18913813bb9f812a537.jpg', 1, 20.00);

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
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`review_id`, `rating`, `review_text`, `review_date`, `product_id`, `customer_id`) VALUES
(1, 4, 'У мене їде криша', '2024-12-27', 1, 2),
(2, 5, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', '2024-12-27', 1, 2),
(3, 5, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', '2024-12-27', 1, 2),
(4, 5, 'Потужно', '2024-12-27', 1, 0),
(5, 5, 'AAAAAAAAAAAAAAAAA', '2024-12-27', 1, 2),
(6, 4, 'Чесно я теж', '2024-12-27', 1, 1),
(7, 5, 'Юі я хочу від тебе дітей', '2024-12-27', 2, 2),
(8, 5, 'Явахуї', '2024-12-27', 1, 2),
(9, 5, 'Якнчл', '2024-12-27', 2, 0),
(10, 1, 'Вона не гола', '2024-12-27', 16, 2),
(11, 4, 'Спааасссиите', '2025-05-28', 1, 19),
(12, 5, 'Шедеврально і неперевершено. Я ХОЧУ СПАТИИ', '2025-05-28', 6, 19);

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
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `wishlists`
--

INSERT INTO `wishlists` (`wishlist_id`, `customer_id`, `product_id`) VALUES
(30, 1, 1),
(31, 1, 11),
(34, 19, 1),
(29, 1, 2),
(32, 19, 2);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
