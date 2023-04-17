




class Brain:
    def __init__(self):
        """
        Long_term_memory - долговечное хранилище информации. В последствии перенести в бд.
        Short_term_memory - кратковременная память. Хранит данные о разговорах которые были недавно.
        Working_memory - рабочая память. Хранит информацию которую нужно будет обработать в данный момент.
        """
        self.long_term_memory = None
        self.short_term_memory = None
        self.working_memory = None



