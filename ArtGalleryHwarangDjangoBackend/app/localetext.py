class Localetext():
    @staticmethod
    def SynchroniseStrings():
        print("synchronised")

    @staticmethod 
    def CreateString():
        print("created")

    @staticmethod 
    def CreateString(localeIdx, newtext):
        print("created")

    @staticmethod 
    def UpdateString(localeIdx, oldtext, newtext):
        print("updated")