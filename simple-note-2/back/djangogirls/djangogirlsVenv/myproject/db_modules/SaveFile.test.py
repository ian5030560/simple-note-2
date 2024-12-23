import unittest

from SaveFile import SaveFile


class TestSaveFile(unittest.TestCase):

    def test_renameAgainstDumplication(self):
        saver = SaveFile("./fileTemp")
        orgin = "1728813361928.jpg"
        expected = "1728813361928.jpg"
        tested = saver.renameAganistDumplication(orgin)
        self.assertEqual(expected, tested)


if __name__ == "__main__":
    unittest.main()
