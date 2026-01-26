"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/generated/prisma";
import { Button } from "./ui/button";

interface ViewFamilyMembersModalProps {
  members: User[];
  familyName: string;
}

export const ViewFamilyMembersModal = ({
  members,
  familyName,
}: ViewFamilyMembersModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {familyName} Members
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {members.length > 0 ? (
            <ul className="space-y-3">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.photo ?? ""} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {member.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-700">{member.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              This family has no members yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
