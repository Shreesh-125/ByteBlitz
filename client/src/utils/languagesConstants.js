export const LANGUAGE_VERSION = {
    cpp: "12.2.0",
    python: "3.10.0",
    java: "15.0.2",
}
export const codeSnippets = {
    python: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

    cpp: `#include <bits/stdc++.h>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
};

export const languagetoIdMap = {
    "cpp":54 , // C++ 17 (GCC 9.2.0)
    "java":62 , // Java (OpenJDK 13)
    "python":71, // Python 3 (3.8.1)
  };
