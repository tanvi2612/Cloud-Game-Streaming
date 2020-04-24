#include "DisplayManager.h"
#include "DuplicationManager.h"
#include "OutputManager.h"
#include "ThreadManager.h"
#include<iostream>
int main(void) {
	DUPLICATIONMANAGER temp;
	FRAME_DATA data;
	bool timeout=false;
	temp.GetFrame(&data,&timeout);
	std::cout << "HI there";
}