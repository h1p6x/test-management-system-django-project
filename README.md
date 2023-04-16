# Test Management System (`Django + React`)

## Основные возможности API

- Создавать и просматривать тестовые проекты
- Закрывать конкретный тестовый проект (возможные статусы проекта `Open` и `Closed`)
- Создавать и просматривать перечни тестов (`testsuit`)

- Создавать и просматривать тесткейсы в рамках перечней тестов (Приоритет у тесткейса может быть: `Lowest`, `Low`, `Medium`, `High`, `Highest`)
- Создавать и просматривать тесткейсы в рамках перечней тестов
- Искать тесткейсы по `title` и `steps`
- Просматривать информацию о конкретном тесткейсе
- Удалять конкретный тесткейсы из базы
- Редактировать конкретный тесткейс
- Создавать тестовый запуски с указанием необходимых для прохождения тесткейсов для конкретного тестового проекта
- Просматривать информацию о конкретном тестовом запуске
- Создавать результат для конкретного тесткейса в рамках определенного тестового запуска (Может быть два состояния у результата `Passed` и `Failed`)

## Авторизация в API

- Возможность получать Bearer токен и авторизироваться по нему в сваггере

## Основные возможности FrontEnd

FrontEnd содержит все необходимые функции BackEnd, а имменно:
 
- На главной странице приложения можно увидеть различную статистику по количеству `Тестовых проектов`, `Тест-сьютов`, `Тест-кейсов`, `Тестовых запусков`. 

- Также на главной странице присутствует таблица со всеми имеющимися тестовыми проектами (с возможностью их закрытия прямо из таблицы) и круговой график, показывающий какое существует количество тестовых запусков, для последних 6 проектов.

![Главная страница](https://github.com/h1p6x/test-management-system-django-project/raw/master/main_page.png)

- На странице `Проекты` также как и на главной странице отображается таблица со всеми имеющимися тестовыми проектами, а также имеется кнопка добавления нового проекта.

![Страница проектов](https://github.com/h1p6x/test-management-system-django-project/raw/master/project_page.png)

![Создание проекта](https://github.com/h1p6x/test-management-system-django-project/raw/master/add_project.png)

### Операции в рамках конкретного тестового проекта

- При переходе на страницу конкретного тестового проекта мы видим таблицы с прикрепленными к проекту тест-сьютами и тестовыми запусками. Также имеется кнопка добавления новых тест-сьютов и тестовых запусков.

![Страница конкретного проекта](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_porject_page.png)

![Страница создание тест-сьюта](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_suit_add.png)

![Страница создание тествого запуска](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_run_add.png)

- При переходе на страницу конкретного тест-сьюта (из страницы конкретного проекта) мы видим таблицу с прикрепленными к тест-сьюту тест-кейсами. Также имеется кнопка добавления новых тест-кейсов и сортировка таблицы по столбцам `Название тест-кейса` и `Шаги`.

![Страница конкретного тест-кейса](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_case_page.png)

![Страница создания тест-кейса](https://github.com/h1p6x/test-management-system-django-project/raw/master/add_test_case_page.png)

- При переходе на страницу конкретного тест-кейса (из страницы конкретного тест-сьюта) мы видим две кнопки `Редактировать тест-кейс` и `Удалить тест-кейс`, при нажатии на кнопку редактирования, поля для ввода становятся доступными, а кнопка `Редактировать тест-кейс` заменяется кнопкой `Сохранить изменения`, по нажатии которой тест-кейс редактируется. Кнопка `Удалить тест-кейс` удаляет тест-кейс.

![Страница редактирования тест-кейса](https://github.com/h1p6x/test-management-system-django-project/raw/master/edit_test_case_page.png)

- При переходе на страницу конкретного тестового запуска (из страницы конкретного проекта) мы видим таблицу с прикрепленными к тестовому запуску тест-кейсами.

![Страница тестового запуска для тестового проекта](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_run_project_page.png)

- При переходе на страницу конкретного тест-кейса, в рамках конкретного тествого запуска мы видим все поля прикрепленного тест-кейса и кнопку `Добавить результат тестового запуска`, если тест-кейс ни разу не запускался. Если же он уже был кем-то запущен, то видим таблицу с результатами запуска.

![Страница конкретного тестового запуска без результат](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_run_result_with_add.png)

![Страница конкретного тестового запуска с результатом](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_run_result_without_add.png)

### Остальные страницы из меню

- На странице `Тест-сьюты` отображается таблица со всеми имеющимися тест-сьютами.

![Страница проектов](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_suits_page.png)

- На странице `Тест-кейсы` отображается таблица со всеми имеющимися тест-кейсами.

![Страница проектов](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_cases_page.png)

- На странице `Тестовые запуски` отображается таблица со всеми имеющимися тестовыми запусками.

![Страница проектов](https://github.com/h1p6x/test-management-system-django-project/raw/master/test_runs_page.png)



