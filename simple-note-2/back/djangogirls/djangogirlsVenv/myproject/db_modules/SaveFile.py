import os
import re


class SaveFile:
    def __init__(self, folder_path) -> None:
        self.folder_path = folder_path
        if not os.path.exists(self.folder_path):
            os.makedirs(self.folder_path)

    def saveNewFile(self, filename, content):
        file_path = os.path.join(self.folder_path, filename)
        with open(file_path, "wb") as file:
            file.write(content)
        print(f"File saved at {file_path}")
        return True

    def renameAganistDumplication(self, filename: str):
        files = os.listdir(self.folder_path)

        sections = filename.split(".")[::-1]
        name = sections[-1]
        extension = ".".join(sections[0:-1][::-1])

        def filterFn(file: str):
            return re.match(rf"{name}(\(\d\))?\.{extension}", file) is not None

        filtered = list(filter(filterFn, files))
        return f"{name}({len(filtered)}).{extension}"
